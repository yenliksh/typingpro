import { EErrorResponseType, TypedRequestBody } from 'common-utils/types';
import express from 'express';
import { body, validationResult } from 'express-validator';
import { GameParticipant } from 'models/GameParticipant';
import { Language } from 'models/Language';
import { User } from 'models/User';
import AWS from 'aws-sdk';
import {
  AWS_ACCESS_KEY_ID,
  AWS_ACCESS_KEY_SECRET,
  AWS_S3_BUCKET_NAME,
} from 'consts/consts';
import { v4 as uuidv4 } from 'uuid';
import Sequelize from 'sequelize';

const s3Client = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_ACCESS_KEY_SECRET,
});
export { s3Client };

const userRouter = express.Router();

userRouter.post(
  '/',
  body('uid').isLength({ min: 1 }),
  async (req: TypedRequestBody<{ uid: string }>, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), type: EErrorResponseType.Validation });
    }

    const uid = res.locals.uid as string;

    if (uid !== req.body.uid) {
      return res.status(403);
    }
    const user = await User.findOne({
      where: {
        uid,
      },
    });
    if (user) {
      return res.json({
        ...user.toJSON(),
      });
    }
    return res.status(404).send();
  }
);

userRouter.patch(
  '/change',
  body('uid').isLength({ min: 3 }),
  body('nickname').isLength({ min: 3 }),
  body('country').isLength({ min: 3 }),
  async (
    req: TypedRequestBody<{ uid: string; nickname: string; country: string }>,
    res
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), type: EErrorResponseType.Validation });
    }
    const authUid = res.locals.uid as string;
    const { uid } = req.body;
    if (uid !== authUid) {
      return res.status(403).send();
    }
    const user = await User.findOne({
      where: {
        uid,
      },
    });
    const { nickname } = req.body;
    const { country } = req.body;
    if (user) {
      await user.set({ nickname, country });
      await user.save();
      return res.json({
        ...user.toJSON(),
      });
    }
    return res.status(404).send();
  }
);

userRouter.patch(
  '/image',
  body('image').isLength({ min: 1 }),
  async (req: TypedRequestBody<{ image: string }>, res) => {
    const uid = res.locals.uid as string;
    const user = await User.findOne({
      where: {
        uid,
      },
    });

    if (!user) {
      return res.status(403);
    }

    const { image } = req.body;

    try {
      if (user.imageUrl)
        await s3Client.deleteObject({
          Bucket: AWS_S3_BUCKET_NAME,
          Key: user.imageUrl,
        });
      const buf = Buffer.from(
        image.replace(/^data:image\/\w+;base64,/, ''),
        'base64'
      );
      const fileName = uuidv4();
      const data = await s3Client
        .upload({
          Body: buf,
          Bucket: AWS_S3_BUCKET_NAME,
          Key: fileName,
          ContentEncoding: 'base64',
          ACL: 'public-read',
        })
        .promise();

      await user.set({
        imageUrl: data.Location,
      });

      await user.save();

      return res.json({
        ...user.toJSON(),
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  }
);

userRouter.get('/languages', async (req: TypedRequestBody<unknown>, res) => {
  const languages = await Language.findAll({});

  if (!languages) return res.status(404).send();

  return res.json([...languages]);
});

userRouter.patch('/cpm-data', async (req, res) => {
  const uid = res.locals.uid as string;
  const user = await User.findOne({
    where: {
      uid,
    },
  });

  if (!user) {
    return res.status(403);
  }

  const userGames = await GameParticipant.findAll({
    where: {
      userId: user.id,
      hasLeft: false,
    },
  });

  if (userGames.length > 12) {
    const count = Math.floor(userGames.length / 12);
    let left = userGames.length - 12 * count;
    let mult = 0;
    const resultUserGames = [];
    for (let ind = 0; ind < 12; ind += 1) {
      let sum = 0;
      for (let ind2 = 0; ind2 < count + left; ind2 += 1) {
        sum += userGames[count * ind + ind2 + mult].cpm;
      }
      resultUserGames.push({
        cpm: sum / count,
        createdAt: userGames[Math.floor((count * ind + mult) / 2)].createdAt,
      });
      if (left > 0) {
        left -= 1;
        mult += 1;
      }
    }
    return res.json(resultUserGames);
  }

  return res.json(userGames);
});

userRouter.patch('/contribution-data', async (req, res) => {
  const uid = res.locals.uid as string;
  const user = await User.findOne({
    where: {
      uid,
    },
  });

  if (!user) {
    return res.status(403);
  }

  const userGames = await GameParticipant.findAll({
    where: {
      userId: user.id,
      hasLeft: false,
      createdAt: {
        [Sequelize.Op.between]: [
          Date.now() - 110 * 24 * 60 * 60 * 1000,
          Date.now(),
        ],
      },
    },
  });

  const userGamesCopy: any[] = [];

  userGames.forEach((userGame) => {
    userGamesCopy.push({
      id: userGame.id,
      createdAt:
        `${userGame.createdAt.getFullYear()}` +
        `-` +
        `${`(0${userGame.createdAt.getMonth() + 1}`.substr(-2)}` +
        '-' +
        `${`${`0${userGame.createdAt.getDate()}`}`.substr(-2)}`,
    });
  });

  const ContributionDataDto: { date: any; count: number }[] = [];

  const uniqueDates = [...new Set(userGamesCopy.map((item) => item.createdAt))];

  uniqueDates.forEach((uniqueDate) => {
    ContributionDataDto.push({
      date: uniqueDate,
      count: userGamesCopy.filter((el) => el.createdAt === uniqueDate).length,
    });
  });

  return res.json(ContributionDataDto);
});

userRouter.patch('/personalstats', async (req, res) => {
  const uid = res.locals.uid as string;
  const user = await User.findOne({
    where: {
      uid,
    },
  });

  if (!user) {
    return res.status(404);
  }

  const userGames = await GameParticipant.findAll({
    where: {
      userId: user.id,
      hasLeft: false,
    },
  });

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
      userGames.reduce((prev, cur) => prev + cur.accuracy, 0) / userGames.length
    ),
    points: user.points,
  };

  return res.json({ ...result });
});

export { userRouter };
