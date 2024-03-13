import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateTweetInput } from '../dto/create-tweet.input';
import { UpdateTweetInput } from '../dto/update-tweet.input';
import { Repository } from 'src/common/database/database-repository.enum';
import { Tweet } from '../entities/tweet.entity';
import { IRepository } from 'src/common/database/repository.interface';
import { BaseHttpException } from 'src/common/exception/base-http.error';
import { ErrorCodeEnum } from 'src/common/exception/error-code.enum';
import { Hashtag } from '../entities/hashtag.entity';
import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { join } from 'path';

@Injectable()
export class TweetService {
  constructor(
    @Inject(Repository.TweetRepository) private tweetRepo: IRepository<Tweet>,
    @Inject(Repository.HashtagRepository)
    private hashTagRepo: IRepository<Hashtag>,
  ) {}
  async addTweet(input: CreateTweetInput, userId: string, image?: string) {
    if (!userId) throw new BaseHttpException(ErrorCodeEnum.UNAUTHORIZED);
    let tweet;
    if (image) {
      tweet = await this.tweetRepo.createOne({
        tweet: input.tweet,
        userId,
        Tweet_Images: [image],
      });
    } else {
      tweet = await this.tweetRepo.createOne({
        tweet: input.tweet,
        userId,
      });
    }
    if (input.hashtag) {
      input.hashtag.map(async (h) => {
        const hashtag = await this.hashTagRepo.findOneOrCreate(
          { HashTag: h },
          { HashTag: h },
        );
        hashtag.$add('tweets', tweet.id);
      });
    }
    return tweet;
  }
  async Retweet(tweetId: string, input: CreateTweetInput, userId: string) {
    return await this.tweetRepo.createOne({
      tweet: input.tweet,
      retweet: tweetId,
      userId,
    });
  }

  async addReply(tweetId: string, input: CreateTweetInput, userId: string) {
    const tweet = await this.tweetRepo.findOne({ id: tweetId });
    if (!tweet) throw new BaseHttpException(ErrorCodeEnum.TWEET_NOT_FOUND);
    const reply = await this.tweetRepo.createOne({
      tweet: input.tweet,
      parentReply: tweetId,
      userId,
    });
    const replies = tweet.replies.concat(reply.id);
    tweet.update({ replies });
    return reply;
  }

  async findAll(page: number, limit: number) {
    const values = await this.tweetRepo.findPaginated({}, page, limit);
    return values
  }

  async findOne(id: number) {
    return await this.tweetRepo.findOne({ id });
  }

  async update(id: number, updateTweetInput: UpdateTweetInput) {
    return await this.tweetRepo.updateAll({ id }, updateTweetInput);
  }

  async remove(id: number) {
    return await this.tweetRepo.deleteAll({ id });
  }

  async addTweetPost(
    input: CreateTweetInput,
    Image: FileUpload,
    userId: string,
  ) {
    const { filename, createReadStream } = Image;
    const newFileName = filename.replace(
      filename.split('.')[0],
      `${filename.split('.')[0].split('-')[0]}-${Date.now()}`,
    );
    return new Promise((res, rej) => {
      createReadStream().pipe(
        createWriteStream(join(process.cwd(), `src/upload/${newFileName}`))
          .on('finish', async () => {
            const tweet = await this.addTweet(input, userId, newFileName);
            res({
              tweet,
            });
          })
          .on('error', (err) => {
            rej(
              new ForbiddenException(`couldn't save img ${newFileName} ${err}`),
            );
          }),
      );
    });
  }
}
