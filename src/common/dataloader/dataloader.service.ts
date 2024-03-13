import { Inject, Injectable } from '@nestjs/common';
import { UserDataLoader } from 'src/user/user.loader';

@Injectable()
export class DataloaderService {
  constructor(
    @Inject(UserDataLoader) private userdataloader: UserDataLoader 
  ) {}

  createLoaders() {
    return {
        ...this.userdataloader.createLoader()
    }
 }
}
