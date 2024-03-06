import { BuildOptions } from 'sequelize';
import { Model } from 'sequelize-typescript';

export interface MyModel extends Model {}

export type MyModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): MyModel;
};
