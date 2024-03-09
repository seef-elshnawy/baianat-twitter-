import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import {
  manualPaginated,
  paginate,
} from 'src/common/paginator/paginator.service';
import { GenderEnum, langEnum } from '../user.enum';
import { getCoulmnEnum } from 'src/common/utils/coulmnEnum';
import { UserVerificationCode } from './user-verification-code.entity';
import { SecurityGroup } from 'src/security-group/entities/security-group.entity';

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

  @Default(GenderEnum.MALE)
  @AllowNull(false)
  @Column({ type: getCoulmnEnum(GenderEnum) })
  @Field(() => GenderEnum)
  gender: GenderEnum;

  @AllowNull(true)
  @Column({ type: DataType.DATE })
  birthDate?: Date;

  @AllowNull(false)
  @Column
  @Field()
  country: string;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  @Field({ nullable: true })
  profilePicture?: string;

  @Default(langEnum.EN)
  @AllowNull(false)
  @Column({ type: getCoulmnEnum(langEnum) })
  @Field(() => langEnum)
  favLang: langEnum;

  @HasMany(() => UserVerificationCode)
  userVerificationCode?: UserVerificationCode[];

  @ForeignKey(() => SecurityGroup)
  @AllowNull(true)
  @Column({ type: DataType.UUID, onDelete: 'SET NULL', onUpdate: 'SET NULL' })
  sucurityGroupId: string;

  @BelongsTo(() => SecurityGroup)
  @Field(() => SecurityGroup, { nullable: true })
  securityGroup?: SecurityGroup;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING })
  @Field()
  email: string;

  @Default(false)
  @AllowNull(false)
  @Column
  @Field()
  isBlocked: boolean;

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
