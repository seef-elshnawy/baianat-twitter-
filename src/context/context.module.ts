import { Global, Module } from '@nestjs/common';
import { ContextService } from './context.service';
import { IContextAuthToken } from './context.interface';

@Global()
@Module({
  providers: [{ useClass: ContextService, provide: IContextAuthToken }],
  exports: [{useClass: ContextService, provide: IContextAuthToken}]
})
export class ContextModule {}
