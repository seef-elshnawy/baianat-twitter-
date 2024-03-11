import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsMobilePhone,
  MinLength,
  MaxLength,
  IsString,
  IsEnum,
  IsISO31661Alpha2,
  ValidateIf,
  IsLongitude,
  IsLatitude
} from 'class-validator';
import { DeviceEnum } from 'src/user/user.enum';
import { ErrorCodeEnum } from 'src/common/exception/error-code.enum';
import { Timestamp } from 'src/common/graphql/timestamp.scalar';

@InputType()
export class RegisterInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(30)
  firstName: string;

  @IsNotEmpty()
  @MaxLength(30)
  @Field()
  lastName: string;

  @IsNotEmpty()
  @Field(type => Timestamp)
  birthDate: Timestamp | number;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  bio?: string;

  @IsEmail()
  @IsOptional()
  @Field({ nullable: true })
  email?: string;

  @IsMobilePhone(null, null, { message: ErrorCodeEnum[ErrorCodeEnum.INVALID_PHONE_NUMBER] })
  @IsNotEmpty()
  @Field()
  phone: string;

  @Field()
  @MinLength(6)
  @MaxLength(30)
  @IsNotEmpty()
  password: string;

  @IsISO31661Alpha2()
  @IsNotEmpty()
  @Field()
  country: string;

}