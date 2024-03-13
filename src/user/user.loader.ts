import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'src/common/database/database-repository.enum';
import { IRepository } from 'src/common/database/repository.interface';
import { User } from './entities/user.entity';
import { HelpService } from 'src/common/utils/helper.service';
import {
  UserDataLoaderType,
  UserLoaderType,
} from 'src/common/dataloader/dataloader.type';
import * as DataLoader from 'dataloader';
import { Tweet } from 'src/tweet/entities/tweet.entity';

@Injectable()
export class UserDataLoader {
  constructor(
    @Inject(Repository.UserRepository) private userRepo: IRepository<User>,
    @Inject(Repository.TweetRepository) private tweetRepo: IRepository<Tweet>,
    private helper: HelpService,
  ) {}
  createLoader(): UserDataLoaderType {
    const userLoader: UserLoaderType = new DataLoader(
      async (usersId: string[]) => await this.findTweetsByUserId(usersId),
    );
    return {
      userLoader,
    };
  }

  async findTweetsByUserId(userIds: string[]) {
    const tweets = await this.tweetRepo.findAll(
      { userId: userIds },
      [],
      [['createdAt', 'DESC']],
    );
    const tweetMap = this.helper.driveMapFromArray(
      tweets,
      (tweet: Tweet) => tweet.userId,
    );
    console.log(userIds.map((id) => tweetMap.get(id)||[]))
    return userIds.map((id) => tweetMap.get(id));
  }
}
