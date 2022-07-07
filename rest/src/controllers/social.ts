import { TypedRequestBody } from 'common-utils/types';
import express from 'express';
import { Friends } from 'models/Friends';
import { GameParticipant } from 'models/GameParticipant';
import { User } from 'models/User';
import Sequelize from 'sequelize';

const socialRouter = express.Router();

socialRouter.get('/allfriends', async (req: TypedRequestBody<unknown>, res) => {
  const uid = res.locals.uid as string;
  const user = await User.findOne({
    where: {
      uid,
    },
  });
  const result = await Friends.findAll({
    where: {
      [Sequelize.Op.or]: [{ toUserId: user?.id }, { fromUserId: user?.id }],
      accepted: true,
    },
    include: [
      { model: User, as: 'fromUser' },
      { model: User, as: 'toUser' },
    ],
  });

  const users = result.map((x) => {
    if (x.toUser.id !== user?.id) return x.toUser;
    return x.fromUser;
  });

  return res.json(users);
});

socialRouter.get(
  '/incomingrequests',
  async (req: TypedRequestBody<unknown>, res) => {
    const uid = res.locals.uid as string;
    const user = await User.findOne({
      where: {
        uid,
      },
    });
    const result = await Friends.findAll({
      where: {
        toUserId: user?.id,
        accepted: null,
      },
      include: [{ model: User, as: 'fromUser' }],
      order: [['createdAt', 'DESC']],
    });

    const users = result.map((x) => {
      return x.fromUser;
    });

    return res.json(users);
  }
);

socialRouter.post(
  '/usersbynickname',
  async (
    req: TypedRequestBody<{ nickname: string; id: number | undefined }>,
    res
  ) => {
    const { nickname } = req.body;
    const { id } = req.body;

    if (id) {
      const result = await User.findAll({
        where: {
          nickname: Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('nickname')),
            'LIKE',
            `%${nickname.toLowerCase()}%`
          ),
          id: {
            [Sequelize.Op.ne]: id,
          },
        },
      });
      return res.json(result);
    }
    const result = await User.findAll({
      where: {
        nickname: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('nickname')),
          'LIKE',
          `%${nickname.toLowerCase()}%`
        ),
      },
    });
    return res.json(result);
  }
);

socialRouter.post(
  '/userbyid',
  async (req: TypedRequestBody<{ id: number }>, res) => {
    const { id } = req.body;
    const user = await User.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(404);
    }

    const avgCmpForEachUser = await GameParticipant.findAll({
      where: {
        hasLeft: false,
      },
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('cpm')), 'avgCpm'],
        'userId',
      ],
      group: ['userId'],
      order: [[Sequelize.fn('AVG', Sequelize.col('cpm')), 'DESC']],
    });

    const userGames = await GameParticipant.findAll({
      where: {
        userId: user.id,
        hasLeft: false,
      },
    });

    avgCmpForEachUser.sort(function (
      a: GameParticipant | null,
      b: GameParticipant | null
    ) {
      if (a && b) return b.cpm - a.cpm;
      return 0;
    });

    const playerIndex = avgCmpForEachUser.findIndex((e) => {
      return e?.userId === user.id;
    });

    const result = {
      nickname: user.nickname,
      image: user.imageUrl,
      cpmAverage: Math.floor(
        userGames.reduce((prev, cur) => prev + cur.cpm, 0) / userGames.length
      ),
      totalPlayedGames: userGames.length,
      betterThanPerc: `${
        playerIndex === avgCmpForEachUser.length - 1 || playerIndex === -1
          ? 0
          : Math.floor(
              ((avgCmpForEachUser.length - playerIndex) /
                avgCmpForEachUser.length) *
                100
            )
      }%`,
      accuracyAverage: Math.floor(
        userGames.reduce((prev, cur) => prev + cur.accuracy, 0) /
          userGames.length
      ),
      points: user.points,
    };

    return res.json({ ...result });
  }
);

socialRouter.post(
  '/friendrequest',
  async (req: TypedRequestBody<{ id: number }>, res) => {
    const { id } = req.body;
    const uid = res.locals.uid as string;
    const user = await User.findOne({
      where: {
        uid,
      },
    });

    const friendRequest = await Friends.findOrCreate({
      where: {
        fromUserId: user?.id,
        toUserId: id,
      },
    });

    if (friendRequest) {
      return res.json({ ...friendRequest });
    }

    return res.status(500);
  }
);

socialRouter.post(
  '/removefriendrequest',
  async (req: TypedRequestBody<{ id: number }>, res) => {
    const { id } = req.body;
    const uid = res.locals.uid as string;
    const user = await User.findOne({
      where: {
        uid,
      },
    });

    try {
      const friend = await Friends.destroy({
        where: {
          fromUserId: user?.id,
          toUserId: id,
        },
      });
      return res.json(friend);
    } catch (e) {
      return res.status(500);
    }
  }
);

socialRouter.post(
  '/denyrequest',
  async (req: TypedRequestBody<{ id: number }>, res) => {
    const { id } = req.body;
    const uid = res.locals.uid as string;
    const user = await User.findOne({
      where: {
        uid,
      },
    });

    try {
      await Friends.destroy({
        where: {
          fromUserId: { [Sequelize.Op.in]: [id, user?.id] },
          toUserId: { [Sequelize.Op.in]: [id, user?.id] },
        },
      });
      return res.json('successfully denied');
    } catch (e) {
      return res.status(500);
    }
  }
);

socialRouter.post(
  '/acceptrequest',
  async (req: TypedRequestBody<{ id: number }>, res) => {
    const { id } = req.body;
    const uid = res.locals.uid as string;
    const user = await User.findOne({
      where: {
        uid,
      },
    });

    try {
      await Friends.update(
        { accepted: true },
        {
          where: {
            fromUserId: id,
            toUserId: user?.id,
          },
        }
      );
      return res.json('successfully accepted');
    } catch (e) {
      return res.status(500);
    }
  }
);

socialRouter.post(
  '/friendstatus',
  async (req: TypedRequestBody<{ id: number }>, res) => {
    const { id } = req.body;
    const uid = res.locals.uid as string;
    const user = await User.findOne({
      where: {
        uid,
      },
    });

    const friendRequest = await Friends.findOne({
      where: {
        fromUserId: { [Sequelize.Op.in]: [id, user?.id] },
        toUserId: { [Sequelize.Op.in]: [id, user?.id] },
      },
    });

    if (friendRequest) return res.json(friendRequest);

    return res.status(404);
  }
);

export { socialRouter };
