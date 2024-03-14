import { registerEnumType } from '@nestjs/graphql';

export enum tweetType {
  AD = 'AD',
  NEWS = 'NEWS',
  TWEET = 'TWEET',
}

registerEnumType(tweetType, { name: 'tweetEnum' });
