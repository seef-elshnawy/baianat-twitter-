import { Global, Injectable } from '@nestjs/common';
import { MyModel, MyModelStatic } from './static-model';
import { IRepository } from './repository.interface';
import {
  WhereOptions,
  IncludeOptions,
  Transaction,
  Includeable,
} from 'sequelize';
import { PaginationRes } from '../paginator/paginator.types';

export function buildRepository(Model: MyModelStatic): any {
  @Global()
  @Injectable()
  class DatabaseRepositoryBuider implements IRepository<MyModel> {
    async findOne(
      where: WhereOptions,
      include: Includeable[] = [],
      attributes?: string[],
    ): Promise<MyModel> {
      return await Model.findOne({
        where,
        include,
        ...(attributes && { attributes }),
      });
    }
    async findAll(
      where: WhereOptions = {},
      include: Includeable[] = [],
      sort = '-createdAt',
      attributes?: string[],
    ): Promise<MyModel[]> {
      if (!sort) sort = '-createdAt';
      let order = null;
      if (typeof sort === 'object') order = sort;
      else
        order = [
          [sort.replace('-', ''), sort.startsWith('-') ? 'DESC' : 'ASC'],
        ];
      return await Model.findAll({
        where,
        include,
        ...(order && { order }),
        ...(attributes && { attributes }),
      });
    }
    async findPaginated(
      where: WhereOptions = {},
      page: number=0,
      limit: number=15,
      sort: any = "-createdAt",
      include: Includeable[]=[],
    ): Promise<PaginationRes<MyModel>> {
      return await (Model as MyModelStatic & { paginate: any }).paginate(
        where,
        sort,
        page,
        limit,
        include,
      );
    }
    async findPaginatedManually(
      items: MyModel[],
      page: number,
      limit: number,
    ): Promise<PaginationRes<MyModel>> {
      return await (
        Model as MyModelStatic & { paginateManually: any }
      ).paginateManually(items, page, limit);
    }
    async sumField(
      field: keyof MyModel,
      where: WhereOptions = {},
      transaction?: Transaction,
    ): Promise<number> {
      const res = await Model.sum(field, {
        where,
        ...(transaction && { transaction }),
      });
      return isNaN(res) ? 0 : res;
    }
    async createOne(input: any, transaction?: Transaction): Promise<MyModel> {
      return await Model.create(input, { ...(transaction && { transaction }) });
    }
    async Bulkcreate(models: Array<any>): Promise<MyModel[]> {
      return await Model.bulkCreate(models);
    }
    async findOneOrCreate(
      where: WhereOptions,
      input: any = {},
    ): Promise<MyModel> {
      let item = await Model.findOne({ where });
      if (!item) item = await Model.create(input);
      return item;
    }
    async updateOneFromExistingModel(
      model: MyModel,
      input: object,
      transaction?: Transaction,
    ): Promise<MyModel> {
      return await model.update(input, { transaction });
    }
    async updateAll(
      where: WhereOptions,
      input: object,
      transaction?: Transaction,
    ): Promise<MyModel[]> {
      const res = await Model.update(input, {
        returning: true,
        where,
        ...(transaction && { transaction }),
      });
      return res[1];
    }
    async deleteAll(
      where: WhereOptions,
      transaction?: Transaction,
    ): Promise<number> {
      return await Model.destroy({
        where,
        ...(transaction && { transaction }),
      });
    }
    async truncateModel(): Promise<void> {
      return await Model.truncate({ force: true, cascade: true });
    }
    async rawDelete(): Promise<void> {
      await Model.sequelize.query(`delete from "${Model.tableName}"`);
    }
    async rawQuery<T>(sql: string): Promise<T> {
      return await Model.sequelize.query(sql)[0];
    }
  }
  return DatabaseRepositoryBuider;
}
