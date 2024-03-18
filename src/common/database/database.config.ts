import { ConfigService } from '@nestjs/config';
import { SequelizeOptions } from 'sequelize-typescript';
import { model } from './database.model';

export const config = (configService: ConfigService) => {
  return <SequelizeOptions>{
    dialect: 'postgres',
    password: configService.get('DATABASE_PASSWORD'),
    username: configService.get('DATABASE_USERNAME'),
    database:
      configService.get('NODE_ENV') === 'test'
        ? configService.get('DATABASE_TEST')
        : configService.get('DATABASE'),
    host: configService.get('DATABASE_HOSTNAME'),
    port: configService.get('DATABASE_PORT'),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    models: model,
  };
};
