import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { ValidPremissons } from 'src/common/custom-validator/valid-premisson';

@ObjectType()
@Table({ timestamps: true, paranoid: true, tableName: 'SecurityGroups' })
export class SecurityGroup extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
  })
  @Field(() => ID)
  id: string;

  
  @Unique
  @AllowNull(false)
  @Column
  @Field()
  groupName: string;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  @Field({ nullable: true })
  description: string;
  
  @ValidPremissons()
  @AllowNull(false)
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  @Field(() => [String])
  premissons: string[];

  @CreatedAt
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  updatedAt: Date;
}
