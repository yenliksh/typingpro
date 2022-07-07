import { TypedRequestBody } from 'common-utils/types';
import { SECONDS_TILL_GAME_STARTS } from 'consts/consts';
import express from 'express';
import { Game } from 'models/Game';
import { GameParticipant } from 'models/GameParticipant';
import { Text } from 'models/Text';
import { User } from 'models/User';
import Sequelize from 'sequelize';

const roomRouter = express.Router();

function updateGameParticipant(
  gameParticipantId: number,
  textPosition: number,
  duration: number,
  gameCurrentTs: number
) {
  return GameParticipant.update(
    {
      accuracy: Math.floor(Math.random() * (100 - 70) + 70),
      cpm: Math.floor(
        Math.floor(textPosition / ((duration * 1000 - gameCurrentTs) / 60000))
      ),
      textPosition,
    },
    {
      where: {
        id: gameParticipantId,
      },
    }
  );
}

function updatePoints(multiplier: number, cpm: number, userId: number) {
  return User.increment(
    {
      points: +(cpm * multiplier),
    },
    {
      where: {
        id: userId,
      },
    }
  );
}

roomRouter.post(
  '/findroom',
  async (req: TypedRequestBody<{ languageId: number }>, res) => {
    const uid = res.locals.uid as string;

    const user = await User.findOne({
      where: {
        uid,
      },
    });

    if (!user?.email) {
      const userGames = await GameParticipant.findAll({
        where: {
          hasLeft: false,
          createdAt: {
            [Sequelize.Op.between]: [
              Date.now() - 24 * 60 * 60 * 1000,
              Date.now(),
            ],
          },
          userId: user?.id,
        },
      });

      if (userGames.length > 10) {
        return res
          .status(403)
          .send({ error: "User can't play more than 10 times" });
      }
    }

    if (!user) {
      return res.status(404).send();
    }

    const { languageId } = req.body;

    const game = await Game.findAll({
      where: {
        isStarted: false,
      },
      include: [
        {
          model: Text,
          where: { languageId },
        },
      ],
      order: [Sequelize.fn('RANDOM')],
      limit: 1,
    });

    if (game.length > 0) {
      await GameParticipant.create({
        uid,
        userId: user.id,
        gameId: game[0].id,
      });
      return res.json({
        ...game[0].toJSON(),
      });
    }

    const textObj = await Text.findAll({
      where: {
        languageId,
      },
      order: [Sequelize.fn('RANDOM')],
      limit: 1,
    });

    const newGame = await Game.create({
      isStarted: false,
      isFinished: false,
      endTimeTs: Date.now() + SECONDS_TILL_GAME_STARTS * 1000,
      textId: textObj[0].id,
    });

    setTimeout(async () => {
      const gameObj = await Game.findOne({
        where: {
          id: newGame.id,
        },
        include: Text,
      });
      if (!gameObj) {
        return;
      }
      const textDuration = gameObj.text.duration;
      gameObj.set({
        isStarted: true,
        endTimeTs: Date.now() + textDuration * 1000,
      });
      gameObj.save();

      const allGameParticipants = await GameParticipant.findAll({
        where: {
          gameId: gameObj.id,
        },
      });

      if (allGameParticipants.length < 4) {
        const promises = [];
        for (let i = 0; i < 4 - allGameParticipants.length; i += 1) {
          promises.push(
            GameParticipant.create({
              isBot: true,
              gameId: gameObj.id,
            })
          );
        }
        await Promise.all(promises);
      }

      setTimeout(async () => {
        newGame.set({
          isFinished: true,
        });
        newGame.save();

        const gameParticipants = await GameParticipant.findAll({
          where: {
            gameId: gameObj.id,
          },
        });

        const textChars = gameObj.text.text.split(' ').join('').length;

        gameParticipants.sort(function dif(a, b) {
          return b.cpm - a.cpm;
        });

        gameParticipants.forEach(async (gameParticipant, index) => {
          if (
            gameParticipant.textPosition === textChars &&
            gameParticipant.isBot === false
          ) {
            if (index === 0) {
              newGame.set({
                winnerId: gameParticipants[0].userId,
              });

              await newGame.save();

              await updatePoints(
                3,
                gameParticipant.cpm,
                gameParticipant.userId
              );
            }
            if (index === 1) {
              await updatePoints(
                2,
                gameParticipant.cpm,
                gameParticipant.userId
              );
            }
            if (index > 1) {
              await updatePoints(
                1,
                gameParticipant.cpm,
                gameParticipant.userId
              );
            }
          }
        });

        if (
          gameParticipants[0].textPosition === textChars &&
          gameParticipants[0].isBot === false
        ) {
          newGame.set({
            winnerId: gameParticipants[0].userId,
          });
          newGame.save();
        }

        setTimeout(async () => {
          await GameParticipant.destroy({
            where: {
              isBot: true,
              gameId: gameObj.id,
            },
          });
        }, 2000);
      }, textDuration * 1000);
    }, SECONDS_TILL_GAME_STARTS * 1000);

    const result = await Game.findOne({
      where: {
        id: newGame.id,
      },
      include: [
        {
          model: Text,
        },
      ],
    });

    if (result) {
      await GameParticipant.create({
        uid,
        userId: user.id,
        gameId: result.id,
      });
      result.save();
      return res.json({
        ...result.toJSON(),
      });
    }
    return res.status(404).send();
  }
);

roomRouter.post(
  '/roomstatus',
  async (
    req: TypedRequestBody<{ position: number; accuracy: number }>,
    res
  ) => {
    const uid = res.locals.uid as string;
    const { position } = req.body;
    const { accuracy } = req.body;

    const user = await User.findOne({
      where: {
        uid,
      },
    });
    if (!user) {
      return res.status(404).send();
    }

    const gameParticipant = await GameParticipant.findOne({
      where: {
        userId: user.id,
      },
      order: [['createdAt', 'DESC']],
    });

    if (!gameParticipant) {
      return res.status(404).send();
    }

    const game = await Game.findOne({
      where: {
        id: gameParticipant.gameId,
      },
      include: Text,
    });

    if (!game) {
      return res.status(404).send();
    }

    const textChars = game.text.text.split(' ').join('').length;

    const gameCurrentTs = (Number(game.endTimeTs) - Date.now()) / 1000;

    if (position !== undefined) {
      gameParticipant.set({
        textPosition: position,
        cpm: Math.floor(position / ((game.text.duration - gameCurrentTs) / 60)),
        accuracy,
      });

      gameParticipant.save();

      const gameParticipants = await GameParticipant.findAll({
        where: {
          gameId: game.id,
        },
        attributes: {
          exclude: [
            'winningPlace',
            'finishedTime',
            'createdAt',
            'updatedAt',
            'gameId',
          ],
        },
      });

      const promises: ReturnType<typeof GameParticipant.update>[] = [];

      const promisesUpdateFinishTime: any[] = [];

      gameParticipants.forEach((gameParticipantEl) => {
        if (gameParticipantEl.isBot) {
          const textPosition =
            gameParticipantEl.textPosition +
            Math.floor(Math.random() * (2 - 0) + 0);
          if (textPosition <= textChars) {
            promises.push(
              updateGameParticipant(
                gameParticipantEl.id,
                textPosition,
                game.text.duration,
                gameCurrentTs
              )
            );
          } else {
            if (gameParticipantEl.gameFinishTs) return;
            promisesUpdateFinishTime.push(
              GameParticipant.update(
                {
                  gameFinishTs: Date.now(),
                },
                {
                  where: {
                    id: gameParticipantEl.id,
                  },
                }
              )
            );
          }
        } else if (gameParticipantEl.textPosition === textChars) {
          promisesUpdateFinishTime.push(
            GameParticipant.update(
              {
                gameFinishTs: Date.now(),
              },
              {
                where: {
                  id: gameParticipantEl.id,
                },
              }
            )
          );
        }
      });

      await Promise.all(promisesUpdateFinishTime);

      await Promise.all(promises);

      const finalGameParticipants = await GameParticipant.findAll({
        where: {
          gameId: game.id,
        },
        attributes: {
          exclude: [
            'winningPlace',
            'finishedTime',
            'createdAt',
            'updatedAt',
            'gameId',
          ],
        },
        include: User,
      });

      finalGameParticipants.sort((a, b) => {
        if (!a.textPosition) {
          return 1;
        }
        if (!b.textPosition) {
          return -1;
        }
        return b.textPosition - a.textPosition;
      });

      finalGameParticipants.sort((a: GameParticipant, b: GameParticipant) => {
        if (!a.gameFinishTs) return 1;
        if (!b.gameFinishTs) return -1;
        return b.gameFinishTs.getDate() - a.gameFinishTs.getDate();
      });

      const result = {
        isStarted: game.isStarted,
        isFinished: game.isFinished,
        endTimeTs: game.endTimeTs,
        gameParticipants: finalGameParticipants,
      };

      return res.json({
        ...result,
      });
    }
    return res.status(500);
  }
);

roomRouter.post('/roomleave', async (req: TypedRequestBody<unknown>, res) => {
  const token = req.get('Authorization');
  if (!token) {
    return res.status(403).send();
  }

  const uid = res.locals.uid as string;

  const user = await User.findOne({
    where: {
      uid,
    },
  });

  if (!user) return res.status(404).send();

  const gameParticipant = await GameParticipant.findOne({
    where: {
      userId: user.getDataValue('id'),
    },
    order: [['createdAt', 'DESC']],
    include: Game,
  });
  if (!gameParticipant) return res.status(404).send();

  const { game } = JSON.parse(JSON.stringify(gameParticipant));

  const gameParticipants = await GameParticipant.findAll({
    where: {
      gameId: game.id,
    },
    attributes: {
      exclude: [
        'id',
        'winningPlace',
        'finishedTime',
        'createdAt',
        'updatedAt',
        'gameId',
      ],
    },
  });

  if (!game.isStarted) {
    GameParticipant.destroy({
      where: { id: gameParticipant.getDataValue('id') },
    });

    if (gameParticipants.length < 2) {
      Game.destroy({ where: { id: game.id } });
      return res.json({
        message: 'succesfully left game, game and player destroyed',
      });
    }
    return res.json({
      message: 'succesfully left game, player destroyed',
    });
  }

  gameParticipant.set({
    hasLeft: true,
  });

  gameParticipant.save();

  return res.json({
    message: 'succesfully left game',
  });
});

export { roomRouter };
