import { Field } from '@nestjs/graphql';
import { PageInfo, PaginationRes } from '../paginator/paginator.types';
import { ClassType, Int, ObjectType } from 'type-graphql';

export interface IGqlSucessResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T | PaginationRes<T>;
}

export interface IGqlErrorResponse {
  code: number;
  success: boolean;
  message: string;
}

export function generateGqlResponseType<T, K>(
  TClass: ClassType<T> | ClassType<T>[],
  isRawArray?: K,
): any {
  interface DataSingleItem {
    data: T;
  }
  interface DataPaginatedType {
    data: PaginationRes<T>;
  }
  interface DataTypeAsArray {
    data: T[];
  }
  type DataType = T extends string
    ? 'string'
    : T extends number
      ? 'number'
      : T extends boolean
        ? 'boolean'
        : T extends undefined
          ? 'undefined'
          : K extends boolean
            ? DataTypeAsArray
            : T extends any[]
              ? DataPaginatedType
              : DataSingleItem;

  const filedType = isRawArray
    ? TClass
    : Array.isArray(TClass)
      ? generateGqlPaginationResponseType<T>(TClass)
      : TClass;
  const className = isRawArray
    ? `${TClass[0].name}sArray`
    : Array.isArray(TClass)
      ? `${TClass[0].name}s`
      : TClass.name;

  @ObjectType(`Gql${className}Response`)
  abstract class GqlResponse {
    @Field((type) => filedType, {
      ...(isRawArray ? { nullable: 'itemsAndList' } : { nullable: true }),
    })
    data?: DataType;

    @Field((type) => String)
    message: string;

    @Field(() => Int)
    code: number;

    @Field()
    success: boolean;
  }
  return GqlResponse;
}

export function generateGqlPaginationResponseType<T>(TClass: ClassType<T>[]) {
  @ObjectType(`Gql${TClass[0].name}sPagination`)
  abstract class GqlPaginationResponse {
    @Field((type) => TClass, { nullable: 'itemsAndList' })
    items?: T[];

    @Field((type) => PageInfo)
    pageInfo: PageInfo;
  }
  return GqlPaginationResponse;
}

export function wrapEntityWithGqlRes<T>(model: T): IGqlSucessResponse<T> {
  return {
    data: model,
    message: 'Opretion done successfull',
    code: 200,
    success: true,
  };
}

export const GqlStringResponse = generateGqlResponseType(String);
export const GqlStringArrayResponse = generateGqlResponseType([String], true);
export const GqlBooleanResponse = generateGqlResponseType(Boolean);

@ObjectType(`GqlDeleteResponse`)
export class GqlDeleteResponse {
  @Field((type) => Int)
  code: number;

  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;
}
