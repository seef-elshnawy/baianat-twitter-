import { Module } from '@nestjs/common';
import { UserService } from './Service/user.service';
import { UserResolver } from './user.resolver';
import { HelperModule } from 'src/common/utils/helper.module';

@Module({
  imports:[HelperModule],
  providers: [UserResolver, UserService],
})
export class UserModule {}
