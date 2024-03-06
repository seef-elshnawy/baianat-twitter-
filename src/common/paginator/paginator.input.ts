import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsOptional, ValidateNested } from 'class-validator';
import { Min } from 'sequelize-typescript';

@InputType()
export class PaginatorInput {
  @Min(1)
  @Field({ defaultValue: 1 })
  page?: number;

  @Min(1)
  @Field({ defaultValue: 15 })
  limit?: number;
}

@ArgsType()
export class NullablePaginatorInput {
  @Field({ nullable: true })
  @IsOptional()
  @ValidateNested()
  paginate?: PaginatorInput;
}
