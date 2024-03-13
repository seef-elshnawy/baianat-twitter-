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
  manualPaginatorReturnsArray,
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

  @AllowNull(true)
  @Column({ type: DataType.STRING })
  @Field()
  notVerifiedEmail: string;

  @Unique
  @AllowNull(true)
  @Column({ type: DataType.STRING })
  @Field()
  VerifiedEmail: string;

  @Default(false)
  @AllowNull(false)
  @Column
  @Field()
  isBlocked: boolean;
  
  @Default([])
  @AllowNull(true)
  @Column({ type:DataType.ARRAY(DataType.STRING) })
  Followers: string[];

  @Default([])
  @AllowNull(true)
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  Followings: string[];

  static async paginate(
    filter = {},
    sort = '-createdAt',
    page = 0,
    limit = 15,
    include: any = [],
  ) {
    return paginate<User>(this, filter, sort, page, limit, include);
  }

  static paginateManually(data: User[], page = 0, limit = 15) {
    return manualPaginatorReturnsArray<User>(
      data,
      {},
      '-createdAt',
      page,
      limit,
    );
  }
}
