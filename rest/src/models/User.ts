import {
  AllowNull,
  Column,
  Default,
  HasMany,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import { GameParticipant } from './GameParticipant';
import { Friends } from './Friends';

@Table
export class User extends Model {
  @Unique
  @Column
  uid: string;

  @Unique
  @Column
  email: string;

  @AllowNull
  @Column
  nickname: string;

  @AllowNull
  @Column
  imageUrl: string;

  @AllowNull
  @Column
  country: string;

  @AllowNull
  @Default(0)
  @Column
  points: number;

  @HasMany(() => GameParticipant)
  gameParticipants: GameParticipant[];

  @HasMany(() => Friends)
  friends: Friends[];
}
