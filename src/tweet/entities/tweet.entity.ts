import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BelongsTo, BelongsToMany, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { User } from 'src/user/entities/user.entity';
import { Hashtag } from './hashtag.entity';
import { TweetHashtag } from './tweetHash.entity';
import { manualPaginatorReturnsArray, paginate } from 'src/common/paginator/paginator.service';

@ObjectType()
@Table({tableName: 'Tweet'})
export class Tweet extends Model{
 @PrimaryKey
 @Default(DataType.UUIDV4)
 @Column({type: DataType.UUID})
 id: string
 @Column({
  type: DataType.STRING,
})
@Field(() => String)
tweet: string;

@ForeignKey(() => User)
@Column({ type: DataType.UUID })
userId: string;

@Column({
  type: DataType.UUID,
})
@ForeignKey(() => Tweet)
@Field(() => String,{nullable:true})
parentReply: string;

@Column({
  type: DataType.UUID,
})
@ForeignKey(() => Tweet)
@Field(() => String,{nullable:true})
retweet: string;
@Column({
  type: DataType.ARRAY(DataType.STRING),
  defaultValue: [],
})
@Field(() => Array(String))
replies: string[];

@Column({
  type: DataType.ARRAY(DataType.STRING),
  defaultValue: [],
})
@Field(() => Array(String))
Tweet_Images: string[];

@BelongsTo(() => User, 'userId')
user: User;

@BelongsTo(() => Tweet, { foreignKey: 'parentReply', as: 'Reply' })
parent: Tweet;

@BelongsTo(() => Tweet, { foreignKey: 'retweet', as: 'parentRetweet' })
parentRetweet: Tweet;

@BelongsToMany(() => Hashtag, () => TweetHashtag)
HashTags: Hashtag[];

static async paginate(
  filter = {},
  sort = '-createdAt',
  page = 0,
  limit = 15,
  include: any = [],
) {
  return paginate<Tweet>(this, filter, sort, page, limit, include);
}

static paginateManually(data: Tweet[], page = 0, limit = 15) {
  return manualPaginatorReturnsArray<Tweet>(data, {}, '-createdAt', page, limit);
}
}
