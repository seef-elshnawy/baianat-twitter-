import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TweetService } from './service/tweet.service';
import { Tweet } from './entities/tweet.entity';
import { CreateTweetInput } from './dto/create-tweet.input';
import { UpdateTweetInput } from './dto/update-tweet.input';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { GqlTweetPaginateResponse, GqlTweetResponse } from './tweet.response';
import { User } from 'src/user/entities/user.entity';
import { Arg } from 'type-graphql';
import { TimeLineInput } from './dto/timeline.dto';
import { GqlBooleanResponse } from 'src/common/graphql/graphql-response-type';

@Resolver(() => Tweet)
export class TweetResolver {
  constructor(private readonly tweetService: TweetService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => GqlTweetResponse)
  createTweet(
    @Args('createTweetInput') createTweetInput: CreateTweetInput,
    @CurrentUser('id') userId: string,
  ) {
    console.log(createTweetInput.tweet_type);
    return this.tweetService.addTweet(createTweetInput, userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => GqlTweetResponse)
  async Retweet(
    @Args('tweetId') tweetId: string,
    @Args('createTweetInput') createTweetInput: CreateTweetInput,
    @CurrentUser('id') userId: string,
  ) {
    return await this.tweetService.Retweet(tweetId, createTweetInput, userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => GqlTweetResponse)
  async Reply(
    @Args('tweetId') tweetId: string,
    @Args('input') createTweetInput: CreateTweetInput,
    @CurrentUser('id') userId: string,
  ) {
    return await this.tweetService.addReply(tweetId, createTweetInput, userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => GqlBooleanResponse)
  async Love(
    @Args('tweetId') tweetId: string,
    @CurrentUser('id') userId: string,
  ) {
    return await this.tweetService.Love(tweetId, userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => GqlBooleanResponse)
  async UnLove(
    @Args('tweetId') tweetId: string,
    @CurrentUser('id') userId: string,
  ) {
    return await this.tweetService.UnLove(tweetId, userId);
  }

  @Query(() => Tweet, { name: 'tweet' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.tweetService.findOne(id);
  }

  @Mutation(() => Tweet)
  updateTweet(@Args('updateTweetInput') updateTweetInput: UpdateTweetInput) {
    return this.tweetService.update(updateTweetInput.id, updateTweetInput);
  }

  @Mutation(() => Tweet)
  removeTweet(@Args('id', { type: () => Int }) id: number) {
    return this.tweetService.remove(id);
  }
  @Query(() => GqlTweetPaginateResponse)
  async getAllTweets(@Args('page') page: number, @Args('limit') limit: number) {
    return await this.tweetService.findAll(page, limit);
  }

  @UseGuards(AuthGuard)
  @Query(() => GqlTweetPaginateResponse)
  async TimeLine(@CurrentUser() user: User, @Args() input: TimeLineInput) {
    return await this.tweetService.TimeLine(
      user,
      input.limit,
      input.cursor,
      input.direction,
    );
  }
}
