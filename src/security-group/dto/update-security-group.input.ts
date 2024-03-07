import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsUUID } from 'sequelize-typescript';
import { InputType, Field } from '@nestjs/graphql';
import { ValidPremissons } from 'src/common/custom-validator/valid-premisson';

@InputType()
export abstract class UpdateSecurityGroupInput {
  @IsNotEmpty()
  @IsUUID('4')
  @Field()
  readonly securityGroupId: string;

  @IsOptional()
  @Field({ nullable: true })
  readonly groupName?: string;

  @IsOptional()
  @Field({ nullable: true })
  readonly description?: string;

  @IsOptional()
  @ValidPremissons()
  @Field((type) => [String], { nullable: 'itemsAndList' })
  readonly permissions?: string[];
}
