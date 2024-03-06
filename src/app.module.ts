import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { TweetModule } from './tweet/tweet.module';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { buildRepository } from './common/database/database-repository.builder';
import { User } from './user/entities/user.entity';
import { DatabaseModule } from './common/database/database.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TweetModule,
    DatabaseModule,
    CommonModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => {
        return {
          autoSchemaFile: true,
          playground: {
            settings: {
              'request.credentials': 'include',
            },
          },
          installSubscriptionHandlers: true,
          context: ({ req }) => ({
            req,
          }),
        };
      },
    }),
  ],
})
export class AppModule {}
