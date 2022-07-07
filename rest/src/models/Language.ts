import { Column, HasMany, Model, Table, Unique } from 'sequelize-typescript';
import { Text } from './Text';

@Table
export class Language extends Model {
  @Unique
  @Column
  language: string;

  @HasMany(() => Text)
  texts: Text[];
}
