import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { GenderEnum } from '../user.enum';

@InputType()
export class UserBoardFilter {
  @IsOptional()
  @Field({ nullable: true })
  searchKey?: string;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  isBlocked?: boolean;

  @IsOptional()
  @Field(() => GenderEnum, { nullable: true })
  @IsEnum(GenderEnum)
  gender?: GenderEnum;
}

@ArgsType()
export class UsersBoardInput {
  @Field({ nullable: true })
  filter?: UserBoardFilter;
}

@ArgsType()
export class UserBoardInput {
  @IsOptional()
  @IsUUID('4', { each: true })
  @Field(type => String)
  userId: string;
}
