import { ConfigService } from '@nestjs/config';
import { SequelizeOptions } from 'sequelize-typescript';

export const config = (configService: ConfigService) => {
  return <SequelizeOptions>{
    dialect: 'postgres',
    password: configService.get('DATABASE_PASSWORD'),
    username: configService.get('DATABASE_USERNAME'),
    database:
      configService.get('NODE_ENV') === 'test'
        ? configService.get('DATABASE_TEST')
        : configService.get('DATABASE'),
    host: 'localhost',
    port: configService.get('DATABASE_PORT'),
    pool:{
        max:5,
        min:0,
        acquire: 30000,
        idle: 10000
    }
  };
};
