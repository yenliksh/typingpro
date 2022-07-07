import { UserDto } from './UserDto';

export interface GameParticipantDto {
  id: number;
  isBot: boolean;
  winningPlace?: number;
  finishedTime?: number;
  accuracy?: number;
  cpm?: number;
  textPosition?: number;
  gameFinishTs?: Date;
  hasLeft?: boolean;
  gameId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user: UserDto;
}
