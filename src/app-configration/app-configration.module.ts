import { Module } from '@nestjs/common';
import { AppConfigrationService } from './app-configration.service';
import { AppConfigrationResolver } from './app-configration.resolver';

@Module({
  providers: [AppConfigrationResolver, AppConfigrationService],
})
export class AppConfigrationModule {}
