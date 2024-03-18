import { Module, ValidationPipe } from '@nestjs/common';
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
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { GqlResponseInterceptor } from './common/graphql/graphql-response.interceptor';
import { MailModule } from './mail/mail.module';
import { TwilloModule } from './twilio/twillo.module';
import { DataloaderModule } from './common/dataloader/dataloader.module';
import { HttpExceptionFilter } from './common/exception/exception-filter';
import { LoggerModule } from './common/logger/logger.module';
import { AppConfigrationModule } from './app-configration/app-configration.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UserModule,
    LoggerModule,
    TweetModule,
    CommonModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
      imports: [ContextModule, DataloaderModule],
    }),
    BullModule.forRoot('config_queue', {
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    SecurityGroupModule,
    MailModule,
    TwilloModule,
    DataloaderModule,
    AppConfigrationModule,
  ],
  providers: [
    Timestamp,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    {
      provide: APP_INTERCEPTOR,
      useClass: GqlResponseInterceptor,
    },
  ],
})
export class AppModule {}
