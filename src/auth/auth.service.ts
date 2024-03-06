import { Inject, Injectable } from '@nestjs/common';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { InjectModel } from '@nestjs/sequelize';
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
    const user = await this.userService.userByNotVerifiedOrVerifiedNumber(
      input.phone,
    );
    this.userVerificationCodeService.validVerificationCodeOrError({
      user,
      useCase: input.useCase,
      verificationCode: input.code,
    });
    return user;
  }
  create(createAuthInput: CreateAuthInput) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthInput: UpdateAuthInput) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
