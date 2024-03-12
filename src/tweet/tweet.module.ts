import { Module } from '@nestjs/common';
import { TweetService } from './service/tweet.service';
import { TweetResolver } from './tweet.resolver';

@Module({
  providers: [TweetResolver, TweetService],
})
export class TweetModule {}
