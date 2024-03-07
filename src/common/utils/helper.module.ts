import { Module } from '@nestjs/common';
import { HelpService } from './helper.service';

@Module({
  providers: [HelpService],
  exports: [HelpService],
})
export class HelperModule {}
