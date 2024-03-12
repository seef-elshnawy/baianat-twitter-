import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateTweetInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  tweet: string;

  @IsString()
  @Field(() => Array(String), { nullable: true })
  hashtag?: string[];
}
