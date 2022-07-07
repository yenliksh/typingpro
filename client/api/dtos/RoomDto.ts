import { GameParticipantStatusDto } from './GameParticipantStatusDto';

export interface RoomStatusDto {
  isFinished: boolean;
  isStarted: boolean;
  endTimeTs: string;
  gameParticipants: GameParticipantStatusDto[];
}
