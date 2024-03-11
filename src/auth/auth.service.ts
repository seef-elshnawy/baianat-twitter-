import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'src/common/database/database-repository.enum';
import { IRepository } from 'src/common/database/repository.interface';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { BaseHttpException } from 'src/common/exception/base-http.error';
import { ErrorCodeEnum } from 'src/common/exception/error-code.enum';
import { IsPhoneExistInput } from 'src/user/dto/is-phone-exist';
import { UserVerificationCode } from 'src/user/entities/user-verification-code.entity';
import { IsUserWithVerificationCodeExistInput } from './dto/is-user-with-verification-exist';
import { UserService } from 'src/user/Service/user.service';
import { UserVerificationCodeService } from 'src/user/Service/user-verification-code.service';
import { RegisterInput } from 'src/user/dto/register.input';
import { UserVerificationCodeUseCaseEnum, langEnum } from 'src/user/user.enum';
import { UserTransformer } from 'src/user/transformer/user.transformer';
import { MailService } from 'src/mail/mail.service';
import { UserValideOtp } from 'src/user/dto/user.valide-otp';
import { UserSignIn } from 'src/user/dto/user.signin';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(Repository.UserRepository)
    private readonly userRepo: IRepository<User>,
    @Inject(Repository.UserVerificationCodeRepository)
    private readonly userVerificationCodesRepo: IRepository<UserVerificationCode>,
    private userService: UserService,
    private userVerificationCodeService: UserVerificationCodeService,
    private userTransformer: UserTransformer,
    private mailService: MailService,
  ) {}

  generateAuthToken(id: string): string {
    return jwt.sign({ userId: id }, this.configService.get('JWT_SECRET'));
  }
  async matchPassword(password: string, hash: string) {
    const isMatched = await bcrypt.compare(password, hash);
    if (!isMatched)
      throw new BaseHttpException(ErrorCodeEnum.INCORRECT_PHONE_OR_PASSWORD);
  }
  appendAuthTokenToUser(user: User) {
    return Object.assign(user, { token: this.generateAuthToken(user.id) });
  }
  async IsVerifiedPhoneExist(input: IsPhoneExistInput) {
    const user = await this.userRepo.findOne({
      where: { VerifiedPhone: input.phone },
    });
    return !!user;
  }
  async userByValidVerificationCodeOrError(
    input: IsUserWithVerificationCodeExistInput,
  ): Promise<User> {
    const user = await this.userService.userByNotVerifiedOrVerifiedPhoneOrError(
      input.phone,
    );
    this.userVerificationCodeService.validVerificationCodeOrError({
      user,
      useCase: input.useCase,
      verificationCode: input.code,
    });
    return user;
  }
  async register(input: RegisterInput, lang: langEnum): Promise<Object> {
    await this.userService.errorIfUserWithVerifiedPhoneExists(input.phone);
    await this.userService.deleteDuplicatedUsersAtNotVerifiedPhone(input.phone);
    await this.userService.deleteDuplicatedUsersAtEmailsIfPhoneNotVerifiedYet(
      input.email,
    );
    await this.userService.errorIfUserWithEmailExists(input.email);
    const transformeredInput =
      await this.userTransformer.registerAsUserInputTransformer(input, lang);
    const user = await this.userRepo.createOne({ ...transformeredInput });
    this.userVerificationCodeService.userShouldNotSendVerificationCodeIfAlreadyVerified(
      user,
      input.phone,
    );
    const code =
      this.userVerificationCodeService.generateVerfifcationCodeAndExpirationDate();
    await this.mailService.sendUserConfirmation(user, code.verificationCode);
    return await this.userVerificationCodesRepo.createOne({
      userId: user.id,
      code: code.verificationCode,
      expiryDate: code.expiryDateAfterOneHour,
      useCase: UserVerificationCodeUseCaseEnum.EMAIL_VERIFICATION,
    });
  }
  async validateOtp(Input: UserValideOtp) {
    const useCase = UserVerificationCodeUseCaseEnum;
    let user;
    if (Input.email) {
      user = await this.userRepo.findOne({
        notVerifiedEmail: Input.email,
      });
      const emailCase = useCase.EMAIL_VERIFICATION;
      await this.userVerificationCodeService.validVerificationCodeOrError({
        user,
        useCase: emailCase,
        verificationCode: Input.otp,
      });
      await this.userVerificationCodeService.deleteVerificationCodeAndUpdateUserModel(
        { user, useCase: emailCase },
        { notVerifiedEmail: null, VerifiedEmail: Input.email },
      );
      return true;
    }
  }

  async signInWithEmailAndPassword(input: UserSignIn) {
    const user = await this.userRepo.findOne({ VerifiedEmail: input.email });
    await this.userService.validePassworOrError(user.password, input.password);
    return this.generateAuthToken(user.id);
  }
}
