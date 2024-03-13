import * as DataLoader from 'dataloader';
import { User } from 'src/user/entities/user.entity';

export type UserLoaderType = DataLoader<string, User>;

export type UserDataLoaderType = {
  userLoader: UserLoaderType;
};
