import { Column, DataType, ForeignKey, Table,Model } from 'sequelize-typescript';
import { Tweet } from './tweet.entity';
import { Hashtag } from './hashtag.entity';

@Table
export class TweetHashtag extends Model {
  @ForeignKey(() => Tweet)
  @Column({ type: DataType.UUID })
  tweetId: string;

  @ForeignKey(() => Hashtag)
  @Column({ type: DataType.UUID })
  hashtagId: string;
}