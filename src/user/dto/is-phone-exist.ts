import { Field, InputType } from '@nestjs/graphql';
import { IsMobilePhone, IsNotEmpty } from 'class-validator';
import { ErrorCodeEnum } from 'src/common/exception/error-code.enum';

@InputType()
export class IsPhoneExistInput {
  @IsMobilePhone(null, null, {
    message: ErrorCodeEnum[ErrorCodeEnum.INVALID_PHONE_NUMBER],
  })
  @IsNotEmpty()
  @Field()
  phone: number;
}
