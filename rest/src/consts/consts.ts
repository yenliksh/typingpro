import dotenv from 'dotenv';

dotenv.config();

export const SECONDS_TILL_GAME_STARTS = 10;

export const EXAMPLE_TEXT =
  // eslint-disable-next-line max-len
  "Mr. Bennet's expectations were fully answered.";

export type TAuthRoute = ['post' | 'get' | 'patch', string];

export const AUTH_ROUTES: TAuthRoute[] = [
  ['post', '/users/create'],
  ['post', '/users'],
  ['patch', '/users/change'],
  ['post', '/rooms/findroom'],
  ['post', '/rooms/roomstatus'],
  ['post', '/rooms/roomleave'],
  ['patch', '/users/cpm-data'],
  ['patch', '/users/contribution-data'],
  ['patch', '/users/image'],
  ['patch', '/users/personalstats'],
  ['post', '/social/friendrequest'],
  ['post', '/social/denyrequest'],
  ['post', '/social/acceptrequest'],
  ['post', '/social/friendstatus'],
  ['get', '/social/allfriends'],
  ['get', '/social/incomingrequests'],
  ['post', '/social/removefriendrequest'],
  ['get', '/leaderboard/friends'],
];

export const { AWS_ACCESS_KEY_ID } = process.env;
export const { AWS_ACCESS_KEY_SECRET } = process.env;
export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME ?? '';

export const SENTRY_DSN =
  'https://a905a9b2955a4c6e921b7940ee27812a@o1136304.ingest.sentry.io/6299210';
