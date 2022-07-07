import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Language } from './Language';

@Table
export class Text extends Model {
  @Column(DataType.TEXT)
  text: string;

  @Column
  duration: number;

  @ForeignKey(() => Language)
  @Column
  languageId: number;

  @BelongsTo(() => Language)
  language: Language;
}
