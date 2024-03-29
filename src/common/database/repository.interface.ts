import { Includeable, Transaction, WhereOptions } from 'sequelize';
import {
  CursorBasedPaginationArgsType,
  PaginationRes,
} from '../paginator/paginator.types';

export interface IRepository<T> {
  findOne(
    where: WhereOptions,
    include?: Includeable[],
    attributes?: string[],
  ): Promise<T>;
  findAll(
    where?: WhereOptions,
    include?: Includeable[],
    sort?: any,
    attributes?: string[],
  ): Promise<T[]>;
  findPaginated(
    where: WhereOptions,
    page: number,
    limit: number,
    sort?: any,
    include?: Includeable[],
  ): Promise<PaginationRes<T>>;
  findPaginatedManually(
    items: T[],
    page: number,
    limit: number,
  ): Promise<PaginationRes<T>>;
  findPaginateCursor<T>(
    args: CursorBasedPaginationArgsType,
  ): Promise<PaginationRes<T>>;
  sumField(
    field: keyof T,
    where: WhereOptions,
    transaction?: Transaction,
  ): Promise<number>;
  createOne(input: object, transaction?: Transaction): Promise<T>;
  Bulkcreate(item: Array<Object>): Promise<T[]>;
  findOneOrCreate(where: WhereOptions, input: object): Promise<T>;
  updateOneFromExistingModel(
    model: T,
    input: object,
    transaction?: Transaction,
  ): Promise<T>;
  updateAll(
    where: WhereOptions,
    input: object,
    transaction?: Transaction,
  ): Promise<T[]>;
  deleteAll(where: WhereOptions, transaction?: Transaction): Promise<number>;
  truncateModel(): Promise<void>;
  rawDelete(): Promise<void>;
  rawQuery<T>(sql: string): Promise<T>;
}
