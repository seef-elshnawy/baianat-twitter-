import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CursorBasedPaginationDirection } from 'src/common/paginator/paginator.types';

@ArgsType()
export class TimeLineInput {
  @IsNotEmpty()
  @Field(() => Number)
  limit: number;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  cursor: string;

  @Field(() => CursorBasedPaginationDirection)
  direction: CursorBasedPaginationDirection;
}
