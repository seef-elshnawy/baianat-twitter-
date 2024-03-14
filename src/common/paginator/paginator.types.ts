import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { WhereOptions, Includeable } from 'sequelize';
import { MyModelStatic } from '../database/static-model';

export enum CursorBasedPaginationDirection {
  BEFORE = 'BEFORE',
  AFTER = 'AFTER',
}
registerEnumType(CursorBasedPaginationDirection, {
  name: 'CursorBasedPaginationDirection',
});

export interface IPaginatedFilter {
  where?: WhereOptions;
  sort?: string;
  page?: number;
  limit?: number;
  include?: Includeable[];
}

export interface PaginationRes<T> {
  items: T[];
  pageInfo: {
    page?: number;
    nextCursor?: string;
    beforeCursor?: string;
    hasNext: boolean;
    hasBefore: boolean;
    limit?: number;
  };
}

@ObjectType()
export abstract class PageInfo {
  @Field((type) => Int, { nullable: true })
  page?: number;

  @Field((type) => Int)
  limit: number;

  @Field((type) => String, { nullable: true })
  nextCursor?: string;

  @Field((type) => String, { nullable: true })
  beforeCursor?: string;
  
  @Field((type) => Boolean)
  hasNext: boolean;

  @Field((type) => Boolean)
  hasBefore: boolean;

}

export interface CursorBasedPaginationArgsType {
  model: MyModelStatic;
  filter: object;
  cursor: string;
  limit: number;
  direction: CursorBasedPaginationDirection;
  include?: Includeable[];
}
