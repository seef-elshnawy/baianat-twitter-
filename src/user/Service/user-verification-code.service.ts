import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'src/common/database/database-repository.enum';
import { UserVerificationCode } from '../entities/user-verification-code.entity';
import { IRepository } from 'src/common/database/repository.interface';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import {
  DeleteVerificationCodeAndUpdateUserModelInput,
  ValidVerificationCodeOrErrorInput,
  VerificationCodeAndExpirationDate,
} from '../user.interface';
import { BaseHttpException } from 'src/common/exception/base-http.error';
import { ErrorCodeEnum } from 'src/common/exception/error-code.enum';

@Injectable()
export class UserVerificationCodeService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(Repository.UserVerificationCodeRepository)
    private readonly userVerificationCodeRepo: IRepository<UserVerificationCode>,
    @Inject(Repository.UserRepository)
    private readonly userRepo: IRepository<User>,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  generateVerfifcationCodeAndExpirationDate(): VerificationCodeAndExpirationDate {
    return {
      verificationCode:
        this.configService.get('NODE_ENV') === 'production'
          ? Math.floor(1000 * Math.random() * 9000).toString()
          : '1234',
      expiryDateAfterOneHour: new Date(Date.now() + 3600000),
    };
  }

  async validVerificationCodeOrError(input: ValidVerificationCodeOrErrorInput) {
    const verificationCode = await this.userVerificationCodeRepo.findOne({
      userId: input.user.id,
      code: input.verificationCode,
      useCase: input.useCase,
    });
    if (!verificationCode)
      throw new BaseHttpException(ErrorCodeEnum.VERIFICATION_CODE_NOT_EXIST);
    if (verificationCode.expiryDate < new Date())
      throw new BaseHttpException(ErrorCodeEnum.EXPIRED_VERIFICATION_CODE);
    return verificationCode;
  }
  userShouldNotSendVerificationCodeIfAlreadyVerified(
    user: User,
    phone: string,
  ) {
    if (user.VerifiedPhone === phone)
      throw new BaseHttpException(ErrorCodeEnum.USER_PHONE_ALREADY_VERIFIED);
  }
  async deleteVerificationCodeAndUpdateUserModel(
    input: DeleteVerificationCodeAndUpdateUserModelInput,
    fieldsWillUpdated: object,
  ): Promise<User> {
    return await this.sequelize.transaction(async (transaction) => {
      await this.userVerificationCodeRepo.deleteAll(
        { userId: input.user.id, useCase: input.useCase },
        transaction,
      );
      return await this.userRepo.updateOneFromExistingModel(
        input.user,
        fieldsWillUpdated,
        transaction,
      );
    });
  }
}
