import { IsNotEmpty, IsString } from 'class-validator';
import { CreateAppConfigrationInput } from './create-app-configration.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAppConfigrationInput extends PartialType(
  CreateAppConfigrationInput,
) {
  @IsNotEmpty()
  @Field(() => String)
  appConfigId: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  key?: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  value?: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  displayAS?: string;
}
