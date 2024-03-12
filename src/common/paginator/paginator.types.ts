import { Field, Int, ObjectType } from '@nestjs/graphql';
import { WhereOptions, Includeable } from 'sequelize';

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
    hasNext: boolean;
    hasBefore: boolean;
    limit?: number
  };
}

@ObjectType()
export abstract class PageInfo {
  @Field((type) => Int, { nullable: true })
  page?: number;

  @Field((type) => Int)
  limit: number;

  @Field((type) => Boolean)
  hasNext: boolean;

  @Field((type) => Boolean)
  hasBefore: boolean;
}
