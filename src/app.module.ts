import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { TweetModule } from './tweet/tweet.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, UserModule, TweetModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
