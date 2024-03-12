import { Literal } from 'sequelize/types/utils';
import { MyModelStatic } from '../database/static-model';
import { PaginationRes } from './paginator.types';

export const paginate = async <T>(
  model: MyModelStatic,
  filter = {},
  sort: string | Literal = '-createdAt',
  page = 0,
  limit = 15,
  include: any = [],
): Promise<PaginationRes<T>> => {
  let totalCount = 0,
    totalPages = 0,
    hasNext = false;
  totalCount = (await model.findAll({ where: filter, include })).length;
  if (limit > 50) limit = 50;
  if (limit < 0) limit = 15;
  if (page < 0) page = 0;
  totalPages = totalCount / limit < 1 ? 1 : Math.ceil(totalCount / limit);
  let skip = page > 1 ? (page - 1) * limit : 0;
  hasNext = skip + limit < totalCount;
  if (!sort) sort = '-createdAt';
  let order = null;
  if (typeof sort === 'object') order = sort;
  else order = [[sort.replace('-', ''), sort.startsWith('-') ? 'DESC' : 'ASC']];
  let items = await model.findAll({
    where: filter,
    ...(order && { order }),
    offset: skip,
    include,
    nest: true,
    raw: true,
  });
  console.log(items)
  return {
    pageInfo: {
      hasNext,
      hasBefore: page > 1,
      page,
      limit
    },
    items: <any>items,
  };
};

export const manualPaginated = async <T>(
  array: T[] = [],
  filter = {},
  sort = '-createdAt',
  page = 0,
  limit = 15,
): Promise<PaginationRes<T>> => {
  let res = {
    pageInfo: {
      page: 0,
      hasNext: false,
      hasBefore: false,
    },
    items: [],
  };
  if (!array || !array.length) return res;
  let totalPages = 0,
    totalCount = 0,
    hasNext = false,
    sortField = sort;
  sortField = sort && sort.startsWith('-') ? sort.replace('-', '') : null;
  let items = !sort
    ? array
    : sort.startsWith('-')
      ? array.sort((a, b) => b[sortField] - a[sortField])
      : array.sort((a, b) => a[sortField] - b[sortField]);
  if (filter && Object.keys(filter).length) {
    items = array.filter((entity) => {
      for (let i in filter) {
        return entity[i] === filter[i];
      }
    });
  }
  totalCount = items.length;
  if (limit > 50) limit = 50;
  if (limit < 0) limit = 15;
  if (page < 0) page = 0;
  totalPages = totalCount / limit < 1 ? 1 : Math.ceil(totalCount / limit);
  let skip = page > 1 ? (page - 1) * limit : 0;
  hasNext = skip + limit < totalCount;
  items = items.slice(skip, limit + skip);
  return {
    pageInfo: {
      page,
      hasNext,
      hasBefore: page > 1,
    },
    items,
  };
};

export const manualPaginatorReturnsArray = <T>(
  array: T[] = [],
  filter = {},
  sort = '-createdAt',
  page = 0,
  limit = 15,
): T[] => {
  if (!array || !array.length) return [];
  let sortField = sort;
  sortField = sort && sort.startsWith('-') ? sort.replace('-', '') : null;
  let items = !sort
    ? array
    : sort.startsWith('-')
      ? array.sort((a, b) => b[sortField] - a[sortField])
      : array.sort((a, b) => a[sortField] - b[sortField]);
  if (filter && Object.keys(filter).length) {
    items = array.filter((entity) => {
      for (let i in filter) {
        return entity[i] === filter[i];
      }
    });
  }
  if (limit > 50) limit = 50;
  if (limit < 0) limit = 15;
  if (page < 0) page = 0;
  let skip = page > 1 ? (page - 1) * limit : 0;
  items = items.slice(skip, limit + skip);
  return items;
};
            