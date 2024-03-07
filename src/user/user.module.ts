import { Module } from '@nestjs/common';
import { UserService } from './Service/user.service';
import { UserResolver } from './user.resolver';
import { HelperModule } from 'src/common/utils/helper.module';
import { UserTransformer } from './transformer/user.transformer';

@Module({
  imports: [HelperModule],
  providers: [UserResolver, UserService, UserTransformer],
})
export class UserModule {}
