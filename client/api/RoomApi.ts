import { EitherType } from '../common-utils/EitherType';
import { Fetcher, IApiError } from '../common-utils/Fetcher';
import { GameTextDto } from './dtos/GameTextDto';
import { RoomStatusDto } from './dtos/RoomDto';

export const apiFindRoom: (args: {
  languageId: number;
}) => Promise<EitherType<IApiError<{ error: string }>, GameTextDto>> = ({
  languageId,
}) =>
  Fetcher.postJson<GameTextDto, { error: string }>({
    url: `rooms/findroom`,
    data: { languageId },
    configs: { withAuth: true, isPatch: false },
  });

export const apiRoomStatus: (args: {
  position: number;
  accuracy: number;
}) => Promise<EitherType<IApiError<unknown>, RoomStatusDto>> = ({
  position,
  accuracy,
}) =>
  Fetcher.postJson<RoomStatusDto>({
    url: `rooms/roomstatus`,
    data: { position, accuracy },
    configs: { withAuth: true, isPatch: false },
  });

export const apiRoomLeave: () => Promise<
  EitherType<IApiError<unknown>, JSON>
> = () =>
  Fetcher.postJson<JSON>({
    url: `rooms/roomleave`,
    data: {},
    configs: { withAuth: true, isPatch: false },
  });
