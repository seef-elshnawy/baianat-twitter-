import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

@InputType()
export class AppConfigurationInput {
  @ValidateIf((o) => !o.appConfigurationId)
  @IsNotEmpty()
  @IsString()
  @Field({ nullable: true })
  key?: string;

  @ValidateIf((o) => !o.key)
  @IsNotEmpty()
  @Field((type) => ID, { nullable: true })
  appConfigurationId?: string;
}
