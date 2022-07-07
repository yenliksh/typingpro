import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Game } from './Game';
import { User } from './User';

@Table
export class GameParticipant extends Model {
  @AllowNull
  @Default(false)
  @Column
  isBot: boolean;

  @AllowNull
  @Column
  winningPlace: number;

  @AllowNull
  @Column
  finishedTime: number;

  @AllowNull
  @Column
  accuracy: number;

  @AllowNull
  @Column
  cpm: number;

  @AllowNull
  @Column
  textPosition: number;

  @AllowNull
  @Column
  gameFinishTs: Date;

  @AllowNull
  @Default(false)
  @Column
  hasLeft: boolean;

  @ForeignKey(() => Game)
  @Column
  gameId: number;

  @BelongsTo(() => Game)
  game: Game;

  @AllowNull
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
