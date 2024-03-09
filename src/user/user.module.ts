import { Module } from '@nestjs/common';
import { UserService } from './Service/user.service';
import { UserResolver } from './user.resolver';
import { HelperModule } from 'src/common/utils/helper.module';
import { UserTransformer } from './transformer/user.transformer';
import { SecurityGroupModule } from 'src/security-group/security-group.module';
import { UserVerificationCodeService } from './Service/user-verification-code.service';

@Module({
  imports: [HelperModule],
  providers: [UserResolver, UserService, UserTransformer,UserVerificationCodeService],
  exports: [UserService, UserTransformer, UserVerificationCodeService],
})
export class UserModule {}
