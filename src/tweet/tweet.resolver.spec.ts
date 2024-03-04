import { Test, TestingModule } from '@nestjs/testing';
import { TweetResolver } from './tweet.resolver';
import { TweetService } from './tweet.service';

describe('TweetResolver', () => {
  let resolver: TweetResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TweetResolver, TweetService],
    }).compile();

    resolver = module.get<TweetResolver>(TweetResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
