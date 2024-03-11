import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsMobilePhone, IsNotEmpty, IsString } from 'class-validator';
import { ErrorCodeEnum } from 'src/common/exception/error-code.enum';

@InputType()
export class UserValideOtp {
  @IsMobilePhone(null, null, {
    message: ErrorCodeEnum[ErrorCodeEnum.INVALID_PHONE_NUMBER],
  })
  @IsNotEmpty()
  @Field({ nullable: true })
  phone?: string;

  @IsEmail()
  @IsString()
  @Field({ nullable: true })
  email?: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  otp: string;
}
