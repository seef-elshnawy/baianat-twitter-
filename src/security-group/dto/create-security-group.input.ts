import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ValidPremissons } from 'src/common/custom-validator/valid-premisson';

@InputType()
export class CreateSecurityGroupInput {
  @IsNotEmpty()
  @Field()
  readonly groupName: string;

  @IsOptional()
  @Field({ nullable: true })
  readonly description?: string;

  @ValidPremissons()
  @Field((type) => String)
  readonly premissons: string[];
}
