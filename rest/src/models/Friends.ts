import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './User';

@Table
export class Friends extends Model {
  @ForeignKey(() => User)
  @Column
  fromUserId: number;

  @BelongsTo(() => User, 'fromUserId')
  fromUser: User;

  @ForeignKey(() => User)
  @Column
  toUserId: number;

  @BelongsTo(() => User, 'toUserId')
  toUser: User;

  @AllowNull
  @Column
  accepted: boolean;
}
