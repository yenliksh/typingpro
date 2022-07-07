export interface GameDto {
  id: number;
  isStarted: boolean;
  isFinished: boolean;
  endTimeTs?: string;
  textId: number;
  winnerId?: number;
  createdAt: string;
  updatedAt: string;
}
