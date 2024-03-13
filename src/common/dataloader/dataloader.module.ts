import { Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { UserDataLoader } from 'src/user/user.loader';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[UserModule],
  providers: [DataloaderService],
  exports: [DataloaderService]
})
export class DataloaderModule {}
