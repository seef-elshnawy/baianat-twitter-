import { Field, InputType } from '@nestjs/graphql';
import { IsMobilePhone, IsNotEmpty, IsEnum } from 'class-validator';
import { ErrorCodeEnum } from 'src/common/exception/error-code.enum';
import { UserVerificationCodeUseCaseEnum } from 'src/user/user.enum';

@InputType()
export class IsUserWithVerificationCodeExistInput {
  @IsNotEmpty()
  @IsMobilePhone(null, null, {
    message: ErrorCodeEnum[ErrorCodeEnum.INVALID_PHONE_NUMBER],
  })
  @Field()
  phone: string;

  @IsNotEmpty()
  @Field()
  code: string;

  @IsEnum(UserVerificationCodeUseCaseEnum)
  @IsNotEmpty()
  @Field((type) => UserVerificationCodeUseCaseEnum)
  useCase: UserVerificationCodeUseCaseEnum;
}
