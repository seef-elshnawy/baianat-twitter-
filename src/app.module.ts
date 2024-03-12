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
import { ContextModule } from './context/context.module';
import { GqlConfigService } from './common/graphql/graphql.provider';
import { Timestamp } from './common/graphql/timestamp.scalar';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GqlResponseInterceptor } from './common/graphql/graphql-response.interceptor';
import { MailModule } from './mail/mail.module';
import { TwilloModule } from './twilio/twillo.module';

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
      useClass: GqlConfigService,
      imports: [ContextModule],
    }),
    SecurityGroupModule,
    MailModule,
    TwilloModule,
  ],
  providers: [
    Timestamp,
    {
      provide: APP_INTERCEPTOR,
      useClass: GqlResponseInterceptor,
    },
  ],
})
export class AppModule {}
