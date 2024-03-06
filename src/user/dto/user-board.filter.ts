import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@ArgsType()
export class UserBoardInput {
  @IsOptional()
  @IsUUID('4', { each: true })
  @Field((type) => String)
  userId: string;
}
