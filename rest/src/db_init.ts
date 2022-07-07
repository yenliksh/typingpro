/* eslint-disable no-console */
import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pgtools = require('pgtools');

dotenv.config();

const config = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: 5432,
};

export const connectDB = () =>
  new Promise((resolve, reject) => {
    pgtools.createdb(config, process.env.DB_DATABASE, (err: any, res: any) => {
      let isAlreadyExists = false;
      if (err) {
        if (!err.message.includes('already exists')) {
          console.error(err);
          reject(new Error('Failed to create database'));
          process.exit(-1);
        } else {
          isAlreadyExists = true;
          console.log('Database already exists');
        }
      }
      if (!isAlreadyExists) {
        console.log('Created database successfully', res);
      }

      const sequelize = new Sequelize({
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        dialect: 'postgres',
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        models: [`${__dirname}/models`],
        logging: false,
      });

      (async () => {
        try {
          await sequelize.authenticate();
          console.log('Connection has been established successfully.');
          resolve(true);
        } catch (error) {
          console.error('Unable to connect to the database:', error);
        }
      })();
    });
  });
