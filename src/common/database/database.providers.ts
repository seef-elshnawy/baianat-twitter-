import { ConfigService } from '@nestjs/config';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { config } from './database.config';

export let sequelizeInstance: Sequelize;

export const databaseProvider = {
  provide: 'SEQUELIZE',
  useFactory: async (configService: ConfigService) => {
    sequelizeInstance = new Sequelize(<SequelizeOptions>config(configService));
    configService.get('NODE_ENV') !== 'testing'
    return sequelizeInstance
  },
  inject:[ConfigService]
};
