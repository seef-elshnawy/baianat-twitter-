import { Literal } from 'sequelize/types/utils';
import { MyModelStatic } from '../database/static-model';
import {
  CursorBasedPaginationDirection,
  PaginationRes,
} from './paginator.types';
import { CursorBasedPaginationArgsType } from './paginator.types';
import { Op } from 'sequelize';
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
  return {
    pageInfo: {
      hasNext,
      hasBefore: page > 1,
      page,
      limit,
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

export const CursourPagination = async <T>(
  args: CursorBasedPaginationArgsType,
): Promise<PaginationRes<T>> => {
  let dateCursor = args.cursor && new Date(Number(args.cursor)),
    sequelizeOperator =
      args.direction === CursorBasedPaginationDirection.AFTER ? Op.lte : Op.gte,
    orderDirection =
      args.direction === CursorBasedPaginationDirection.AFTER ? 'DESC' : 'ASC';

  const items = await args.model.findAll({
    where: {
      ...args.filter,
      ...(dateCursor && {
        createdAt: { [sequelizeOperator]: new Date(dateCursor) },
      }),
    },
    order: [['createdAt', orderDirection]],
    limit: args.limit + 1,
    include: args.include,
    nest: true,
    logging: true,
    raw: true,
  });
  let hasNext = items.length === args.limit + 1,
    hasBefore = items.length === args.limit + 1,
    nextCursor = null,
    beforeCursor = null,
    nextCursorRecord = hasNext ? items[args.limit] : null,
    beforeCursorRecord = hasBefore ? items[args.limit] : null;

  if (!items.length) {
    return {
      pageInfo: { nextCursor, hasNext, beforeCursor, hasBefore },
      items: <any>items,
    };
  }

  if (!dateCursor) dateCursor = new Date(items[0].createdAt);
  if (args.direction === CursorBasedPaginationDirection.AFTER) {
    const beforeItem = await args.model.findOne({
      where: {
        ...args.filter,
        ...(dateCursor && { createdAt: { [Op.gt]: new Date(dateCursor) } }),
      },
      order: [['createdAt', 'ASC']],
      limit: 1,
      include: args.include,
      nest: true,
      raw: true,
      attributes: ['createdAt'],
    });
    hasBefore = !!beforeItem;
    if (beforeItem) {
      beforeCursorRecord = beforeItem;
      items.unshift(beforeItem);
    }
  }
  if (args.direction === CursorBasedPaginationDirection.BEFORE) {
    const nextItem = await args.model.findOne({
      where: {
        ...args.filter,
        ...(dateCursor && { createdAt: { [Op.lt]: new Date(dateCursor) } }),
      },
      order: [['createdAt', 'DESC']],
      include: args.include,
      nest: true,
      raw: true,
      attributes: ['createdAt'],
    });
    hasNext = !!nextItem;
    if (nextItem) {
      nextCursorRecord = nextItem;
      items.push(nextItem);
    }
  }
  if (hasNext) {
    nextCursor = nextCursorRecord.createdAt.getTime().toString();
    items.pop();
  }
  if (hasBefore) {
    beforeCursor = beforeCursorRecord.createdAt.getTime().toString();
    items.shift();
  }
  if (args.direction === CursorBasedPaginationDirection.BEFORE) items.reverse();
  return {
    pageInfo: { nextCursor, hasNext, beforeCursor, hasBefore },
    items: <any>items,
  };
};
