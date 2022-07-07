import { EitherType } from '../common-utils/EitherType';
import { Fetcher, IApiError } from '../common-utils/Fetcher';
import { TopPlayersDto } from './dtos/TopPlayersDto';

export const apiLeaderBoard: () => Promise<
  EitherType<IApiError<unknown>, TopPlayersDto[]>
> = () =>
  Fetcher.getJson<TopPlayersDto[]>({
    url: `leaderboard/players`,
    configs: { withAuth: false, isPatch: false },
  });

export const apiLeaderBoardAllTheTime: () => Promise<
  EitherType<IApiError<unknown>, TopPlayersDto[]>
> = () =>
  Fetcher.getJson<TopPlayersDto[]>({
    url: `leaderboard/allthetimeplayers`,
    configs: { withAuth: false, isPatch: false },
  });

export const apiFriends: () => Promise<
  EitherType<IApiError<unknown>, TopPlayersDto[]>
> = () =>
  Fetcher.getJson<TopPlayersDto[]>({
    url: `leaderboard/friends`,
    configs: { withAuth: true, isPatch: false },
  });
