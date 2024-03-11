import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { UserVerificationCodeUseCaseEnum } from '../user.enum';
import { getCoulmnEnum } from 'src/common/utils/coulmnEnum';
import { User } from './user.entity';

@Table({ tableName: 'UserVerificationCode', timestamps: true })
export class UserVerificationCode extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
  })
  id: string;

  @Default(UserVerificationCodeUseCaseEnum.PASSWORD_RESET)
  @AllowNull(false)
  @Column(getCoulmnEnum(UserVerificationCodeUseCaseEnum))
  useCase: UserVerificationCodeUseCaseEnum;

  @AllowNull(false)
  @Column
  code: string;

  @AllowNull(false)
  @Column({
    type: DataType.DATE,
  })
  expiryDate: Date;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;
}
