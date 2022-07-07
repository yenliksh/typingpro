import AdminJSExpress from '@adminjs/express';
import AdminJSSequelize from '@adminjs/sequelize';
import AdminJS from 'adminjs';
import * as Sentry from '@sentry/node';
import bodyParser from 'body-parser';
import { SENTRY_DSN, AUTH_ROUTES, EXAMPLE_TEXT } from 'consts/consts';
import { leaderBoardRouter } from 'controllers/leaderboard';
import { roomRouter } from 'controllers/room';
import { socialRouter } from 'controllers/social';
import cors from 'cors';
import { connectDB } from 'db_init';
import dotenv from 'dotenv';
import express from 'express';
import firebaseAdmin from 'firebase-admin';
import { Friends } from 'models/Friends';
import { Game } from 'models/Game';
import { GameParticipant } from 'models/GameParticipant';
import { Language } from 'models/Language';
import { Text } from 'models/Text';
import { User } from 'models/User';
import firebaseServiceAccount from 'secrets/firebase';
import { userRouter } from './controllers/user';

dotenv.config();

Sentry.init({
  dsn: SENTRY_DSN,
  debug: true,
  environment: process.env.NODE_ENV,
});

(async () => {
  await connectDB();
  await Language.sync();
  await User.sync();
  await Text.sync();
  await Game.sync();
  await GameParticipant.sync();
  await Friends.sync();

  const [language] = await Language.findOrCreate({
    where: {
      language: 'English',
    },
    defaults: {
      language: 'English',
    },
  });

  await Text.findOrCreate({
    where: {
      text: EXAMPLE_TEXT,
    },
    defaults: {
      text: EXAMPLE_TEXT,
      duration: 20,
      languageId: language.id,
    },
  });

  const app = express();

  AdminJS.registerAdapter(AdminJSSequelize);

  const adminJs = new AdminJS({
    resources: [
      {
        resource: Text,
      },
      {
        resource: Language,
      },
    ],
    rootPath: '/admin',
  });

  const router = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      cookieName: process.env.ADMIN_COOKIE_NAME || '',
      cookiePassword: process.env.ADMIN_COOKIE_PASSWORD || '',
      authenticate: async (email, password) => {
        if (
          process.env.ADMIN_PASSWORD === password &&
          process.env.ADMIN_LOGIN === email
        ) {
          return true;
        }
        return false;
      },
    },
    null,
    {
      resave: false,
      saveUninitialized: true,
      secret: process.env.ADMIN_SESSION_SECRET || '',
    }
  );

  app.use(adminJs.options.rootPath, router);

  const port = process.env.PORT || 3000;

  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(async (req, res, next) => {
    if (
      !AUTH_ROUTES.find(
        (route) =>
          route[0] === req.method.toLowerCase() && req.originalUrl === route[1]
      )
    ) {
      return next();
    }
    const token = req.get('Authorization');
    if (!token) {
      return res.status(403).send();
    }
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    const { uid, email } = decodedToken;
    res.locals.uid = uid;
    res.locals.email = email;
    return next();
  });

  app.use(async (req, res, next) => {
    const { uid, email } = res.locals as { uid?: string; email?: string };
    if (!uid) {
      return next();
    }
    try {
      const [user] = await User.findOrCreate({
        where: {
          uid,
        },
        defaults: {
          uid,
          email,
        },
      });
      if (user && email && !user.email) {
        user.email = email;
        await user.save();
      }
    } catch (err) {
      return res
        .status(500)
        .send({ error: 'Error in the user management middleware' });
    }
    return next();
  });

  app.use('/users', userRouter);
  app.use('/rooms', roomRouter);
  app.use('/leaderboard', leaderBoardRouter);
  app.use('/social', socialRouter);

  app.get('/', (req, res) => {
    res.send('Hello');
  });

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`server started at http://localhost:${port}`);
  });
})();

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
});
