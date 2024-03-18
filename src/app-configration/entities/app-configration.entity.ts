import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

@ObjectType()
@Table({ tableName: 'AppConfigrations', paranoid: true, timestamps: true })
export class AppConfigration extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  @Field(type => ID)
  id: string;

  @Unique
  @AllowNull(false)
  @Column
  @Field()
  key: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  @Field()
  value: string;

  @AllowNull(false)
  @Column
  @Field()
  displayAs: string;
}
