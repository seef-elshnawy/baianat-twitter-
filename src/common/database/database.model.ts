import { User } from 'src/user/entities/user.entity';
import { plural } from 'pluralize';
import { buildRepository } from './database-repository.builder';
import { UserVerificationCode } from 'src/user/entities/user-verification-code.entity';
import { SecurityGroup } from 'src/security-group/entities/security-group.entity';
import { TweetHashtag } from 'src/tweet/entities/tweetHash.entity';
import { Hashtag } from 'src/tweet/entities/hashtag.entity';
import { Tweet } from 'src/tweet/entities/tweet.entity';
import { Category } from 'src/user/entities/category.entity';

export const model = [
  User,
  UserVerificationCode,
  SecurityGroup,
  TweetHashtag,
  Hashtag,
  Tweet,
  Category
];
export const repositories = model.map((m) => ({
  provide: `${plural(m.name)}Repository`,
  useClass: buildRepository(m),
}));