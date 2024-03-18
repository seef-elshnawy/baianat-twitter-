import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateAppConfigrationInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  key: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  value: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  displayAS: string;
}
