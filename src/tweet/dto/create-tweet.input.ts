import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { tweetType } from '../tweet.enum';

@InputType()
export class CreateTweetInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  tweet: string;

  @IsString()
  @Field(() => Array(String), { nullable: true })
  hashtag?: string[];

  @IsNotEmpty()
  @IsString()
  @Field(() => tweetType)
  tweet_type: tweetType
}
