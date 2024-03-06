import { DataType as DataTypeObj } from 'sequelize-typescript';
import { DataType } from 'sequelize/types';

export function getCoulmnEnum(enumValue: object): DataType {
  return DataTypeObj.ENUM(...Object.values(enumValue));
}
