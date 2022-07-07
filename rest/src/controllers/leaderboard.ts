import { TypedRequestBody } from 'common-utils/types';
import express from 'express';
import { Friends } from 'models/Friends';
import { Game } from 'models/Game';
import { Text } from 'models/Text';
import { GameParticipant } from 'models/GameParticipant';
import { User } from 'models/User';
import Sequelize from 'sequelize';

const leaderBoardRouter = express.Router();

const asyncFilter = async (arr: any[], predicate: any) => {
  const results = await Promise.all(arr.map(predicate));

  return arr.filter((_v, index) => results[index]);
};

leaderBoardRouter.get(
  '/players',
  async (req: TypedRequestBody<unknown>, res) => {
    const gameParticipants = await GameParticipant.findAll({
      where: {
        hasLeft: false,
        isBot: false,
        createdAt: {
          [Sequelize.Op.between]: [
            Date.now() - 24 * 60 * 60 * 1000,
            Date.now(),
          ],
        },
      },
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('userId')), 'userId'],
      ],
    });

    if (gameParticipants.length === 0) {
      return res.json([]);
    }

    try {
      const finalGameParticipants = await Promise.all(
        gameParticipants.map((el) => {
          return GameParticipant.findOne({
            where: {
              hasLeft: false,
              createdAt: {
                [Sequelize.Op.between]: [
                  Date.now() - 24 * 60 * 60 * 1000,
                  Date.now(),
                ],
              },
              userId: el.userId,
            },
            order: [['cpm', 'DESC NULLS LAST']],
            include: [
              {
                model: User,
              },
            ],
          });
        })
      );

      const result = await asyncFilter(
        finalGameParticipants,
        async (gameP: GameParticipant) => {
          const game = await Game.findOne({
            where: { id: gameP?.gameId },
            include: Text,
          });
          const textChars = game?.text.text.split(' ').join('').length;
          return gameP?.user.email && textChars === gameP.textPosition;
        }
      );

      result.slice(0, 10);

      result.sort(function (
        a: GameParticipant | null,
        b: GameParticipant | null
      ) {
        if (a && b) return b.cpm - a.cpm;
        return 0;
      });

      return res.json(result);
    } catch (e) {
      return res.status(404);
    }
  }
);

leaderBoardRouter.get(
  '/allthetimeplayers',
  async (req: TypedRequestBody<unknown>, res) => {
    const gameParticipants = await GameParticipant.findAll({
      where: {
        hasLeft: false,
        isBot: false,
      },
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('userId')), 'userId'],
      ],
    });

    if (gameParticipants.length === 0) {
      return res.status(404).send();
    }

    try {
      const finalGameParticipants = await Promise.all(
        gameParticipants.map((el) => {
          return GameParticipant.findOne({
            where: {
              hasLeft: false,
              userId: el.userId,
            },
            order: [['cpm', 'DESC NULLS LAST']],
            include: [
              {
                model: User,
              },
            ],
          });
        })
      );
      const result = finalGameParticipants.filter((gameParticipant) => {
        return !!gameParticipant?.user.email || null;
      });

      result.slice(0, 10);

      result.sort(function (
        a: GameParticipant | null,
        b: GameParticipant | null
      ) {
        if (a && b) return b.cpm - a.cpm;
        return 0;
      });

      return res.json(result);
    } catch (e) {
      return res.status(404);
    }
  }
);

leaderBoardRouter.get(
  '/friends',
  async (req: TypedRequestBody<unknown>, res) => {
    const uid = res.locals.uid as string;
    const user = await User.findOne({
      where: {
        uid,
      },
    });

    const friends = await Friends.findAll({
      where: {
        [Sequelize.Op.or]: [{ toUserId: user?.id }, { fromUserId: user?.id }],
        accepted: true,
      },
      include: [
        { model: User, as: 'fromUser' },
        { model: User, as: 'toUser' },
      ],
    });

    const usersId = friends.map((x) => {
      if (x.toUser.id !== user?.id) return x.toUser.id;
      return x.fromUser.id;
    });

    try {
      const finalGameParticipants = await Promise.all(
        [...usersId, user?.id].map((el) => {
          return GameParticipant.findOne({
            where: {
              hasLeft: false,
              userId: el,
            },
            order: [['cpm', 'DESC NULLS LAST']],
            include: [
              {
                model: User,
              },
            ],
          });
        })
      );
      const result = finalGameParticipants.filter((gameParticipant) => {
        return gameParticipant?.user || null;
      });

      result.slice(0, 10);

      result.sort(function (
        a: GameParticipant | null,
        b: GameParticipant | null
      ) {
        if (a && b) return b.cpm - a.cpm;
        return 0;
      });

      return res.json(result);
    } catch (e) {
      return res.status(404);
    }
  }
);

export { leaderBoardRouter };
