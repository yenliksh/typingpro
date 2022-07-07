import { EitherType } from '../common-utils/EitherType';
import { Fetcher, IApiError } from '../common-utils/Fetcher';
import { FriendsDto } from './dtos/FriendsDto';
import { PersonalStatsDto } from './dtos/PersonalStatsDto';
import { UserDto } from './dtos/UserDto';

export const apiUsersByNickname: (args: {
  nickname: string;
  id: number | undefined;
}) => Promise<EitherType<IApiError<unknown>, UserDto[]>> = ({ nickname, id }) =>
  Fetcher.postJson<UserDto[]>({
    url: `social/usersbynickname`,
    data: { nickname, id },
    configs: { withAuth: false, isPatch: false },
  });

export const apiAllFriends: () => Promise<
  EitherType<IApiError<unknown>, UserDto[]>
> = () =>
  Fetcher.getJson<UserDto[]>({
    url: `social/allfriends`,
    configs: { withAuth: true, isPatch: false },
  });

export const apiIncomingRequests: () => Promise<
  EitherType<IApiError<unknown>, UserDto[]>
> = () =>
  Fetcher.getJson<UserDto[]>({
    url: `social/incomingrequests`,
    configs: { withAuth: true, isPatch: false },
  });

export const apiGetPersonalStatsById: (args: {
  id: number;
}) => Promise<EitherType<IApiError<unknown>, PersonalStatsDto>> = ({ id }) =>
  Fetcher.postJson<PersonalStatsDto>({
    url: `social/userbyid`,
    data: { id },
    configs: { withAuth: true, isPatch: false },
  });

export const apiSendFriendRequest: (args: {
  id: number;
}) => Promise<EitherType<IApiError<unknown>, FriendsDto>> = ({ id }) =>
  Fetcher.postJson<FriendsDto>({
    url: `social/friendrequest`,
    data: { id },
    configs: { withAuth: true, isPatch: false },
  });

export const apiRemoveFriendRequest: (args: {
  id: number;
}) => Promise<EitherType<IApiError<unknown>, FriendsDto>> = ({ id }) =>
  Fetcher.postJson<FriendsDto>({
    url: `social/removefriendrequest`,
    data: { id },
    configs: { withAuth: true, isPatch: false },
  });

export const apiDenyFriendRequest: (args: {
  id: number;
}) => Promise<EitherType<IApiError<unknown>, FriendsDto>> = ({ id }) =>
  Fetcher.postJson<FriendsDto>({
    url: `social/denyrequest`,
    data: { id },
    configs: { withAuth: true, isPatch: false },
  });

export const apiAcceptFriendRequest: (args: {
  id: number;
}) => Promise<EitherType<IApiError<unknown>, FriendsDto>> = ({ id }) =>
  Fetcher.postJson<FriendsDto>({
    url: `social/acceptrequest`,
    data: { id },
    configs: { withAuth: true, isPatch: false },
  });

export const apiFriendStatus: (args: {
  id: number;
}) => Promise<EitherType<IApiError<unknown>, FriendsDto>> = ({ id }) =>
  Fetcher.postJson<FriendsDto>({
    url: `social/friendstatus`,
    data: { id },
    configs: { withAuth: true, isPatch: false },
  });
