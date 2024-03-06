import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  AllowNull,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import {
  manualPaginated,
  paginate,
} from 'src/common/paginator/paginator.service';

@ObjectType()
@Table({ tableName: 'User', timestamps: true })
export class User extends Model {
  @AllowNull(false)
  @Field()
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @AllowNull(false)
  @Field()
  @Column
  firstName: string;

  @AllowNull(false)
  @Field()
  @Column
  lastName: string;

  @AllowNull(false)
  @Field()
  @Column
  fullName?: string;

  @Field()
  @AllowNull(false)
  @Unique
  @Column
  slag: string;

  @AllowNull(true)
  @Column
  notVerifiedPhone?: string;

  @Unique
  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  @Field()
  VerifiedPhone?: string;

  @AllowNull(true)
  @Field({ nullable: true })
  @Column
  bio?: string;

  @AllowNull(true)
  @Column
  password: string;

  static async paginate(
    filter = {},
    sort = '-createdAt',
    page = 0,
    limit = 15,
    include: any = [],
  ) {
    return await paginate(this, filter, sort, page, limit, include);
  }

  static async paginateManually(data: User[], page = 0, limit = 15) {
    return await manualPaginated<User>(data, {}, '-createdAt', page, limit);
  }
}
