import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { TweetModule } from './tweet/tweet.module';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { buildRepository } from './common/database/database-repository.builder';
import { User } from './user/entities/user.entity';
import { DatabaseModule } from './common/database/database.module';
import { SecurityGroupModule } from './security-group/security-group.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    TweetModule,
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
    SecurityGroupModule,
  ],
})
export class AppModule {}
