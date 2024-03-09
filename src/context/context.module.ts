import { Module } from '@nestjs/common';
import { ContextService } from './context.service';
import { IContextAuthToken } from './context.interface';
@Module({
  providers: [{ useClass: ContextService, provide: IContextAuthToken }],
})
export class ContextModule {}
