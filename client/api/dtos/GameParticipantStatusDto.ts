import { GameParticipantDto } from './GameParticipantDto';

export type GameParticipantStatusDto = Pick<
  GameParticipantDto,
  | 'id'
  | 'userId'
  | 'textPosition'
  | 'isBot'
  | 'cpm'
  | 'accuracy'
  | 'hasLeft'
  | 'user'
  | 'gameFinishTs'
>;
