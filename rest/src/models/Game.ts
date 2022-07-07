import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { GameParticipant } from './GameParticipant';
import { Text } from './Text';
import { User } from './User';

@Table
export class Game extends Model {
  @Default(false)
  @Column
  isStarted: boolean;

  @Default(false)
  @Column
  isFinished: boolean;

  @AllowNull
  @Column
  endTimeTs: bigint;

  @ForeignKey(() => Text)
  @Column
  textId: number;

  @BelongsTo(() => Text)
  text: Text;

  @ForeignKey(() => User)
  @Column
  winnerId: number;

  @BelongsTo(() => User)
  winner: User;

  @HasMany(() => GameParticipant)
  gameParticipants: GameParticipant[];
}
