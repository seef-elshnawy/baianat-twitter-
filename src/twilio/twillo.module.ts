import { Module } from '@nestjs/common';
import { TwilloService } from './twillo.service';

@Module({
  providers: [TwilloService],
  exports: [TwilloService]
})
export class TwilloModule {}
