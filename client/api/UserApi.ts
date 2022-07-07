import { EitherType } from '../common-utils/EitherType';
import { Fetcher, IApiError } from '../common-utils/Fetcher';
import { ContributionDataDto } from './dtos/ContributionDataDto';
import { GameParticipantDto } from './dtos/GameParticipantDto';
import { LanguageDto } from './dtos/LanguageDto';
import { PersonalStatsDto } from './dtos/PersonalStatsDto';
import { UserDto } from './dtos/UserDto';

export const apiUserGet: (args: {
  uid: string;
}) => Promise<EitherType<IApiError<unknown>, UserDto>> = ({ uid }) =>
  Fetcher.postJson<UserDto>({
    url: `users`,
    data: { uid },
    configs: { withAuth: true, isPatch: false },
  });

export const apiSetUserChanges: (args: {
  uid: string;
  nickname: string;
  country: string;
}) => Promise<EitherType<IApiError<unknown>, UserDto>> = ({
  uid,
  nickname,
  country,
}) =>
  Fetcher.postJson<UserDto>({
    url: `users/change`,
    data: { uid, nickname, country },
    configs: { withAuth: true, isPatch: true },
  });

export const apiSetImage: (args: {
  image: string;
}) => Promise<EitherType<IApiError<unknown>, UserDto>> = ({ image }) =>
  Fetcher.postJson<UserDto>({
    url: `users/image`,
    data: { image },
    configs: { withAuth: true, isPatch: true },
  });

export const apiSetLanguage: (args: {
  uid: string;
  languageId: number;
}) => Promise<EitherType<IApiError<unknown>, UserDto>> = ({
  uid,
  languageId,
}) =>
  Fetcher.postJson<UserDto>({
    url: `users/language`,
    data: { uid, languageId },
    configs: { withAuth: true, isPatch: true },
  });

export const apiAllLanguages: () => Promise<
  EitherType<IApiError<unknown>, LanguageDto[]>
> = () =>
  Fetcher.getJson<LanguageDto[]>({
    url: `users/languages`,
    configs: { withAuth: false, isPatch: false },
  });

export const apiCPMdata: () => Promise<
  EitherType<IApiError<unknown>, GameParticipantDto[]>
> = () =>
  Fetcher.postJson<GameParticipantDto[]>({
    url: `users/cpm-data`,
    data: {},
    configs: { withAuth: true, isPatch: true },
  });

export const apiContributionData: () => Promise<
  EitherType<IApiError<unknown>, ContributionDataDto[]>
> = () =>
  Fetcher.postJson<ContributionDataDto[]>({
    url: `users/contribution-data`,
    data: {},
    configs: { withAuth: true, isPatch: true },
  });

export const apiPersonalStats: () => Promise<
  EitherType<IApiError<unknown>, PersonalStatsDto>
> = () =>
  Fetcher.postJson<PersonalStatsDto>({
    url: `users/personalstats`,
    data: {},
    configs: { withAuth: true, isPatch: true },
  });
