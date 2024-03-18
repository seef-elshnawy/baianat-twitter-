import { Module } from '@nestjs/common';
import { UserService } from './Service/user.service';
import { UserResolver } from './user.resolver';
import { HelperModule } from 'src/common/utils/helper.module';
import { UserTransformer } from './transformer/user.transformer';
import { SecurityGroupModule } from 'src/security-group/security-group.module';
import { UserVerificationCodeService } from './Service/user-verification-code.service';
import { UserDataLoader } from './user.loader';
import { MailService } from 'src/mail/service/mail.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [HelperModule,MailModule],
  providers: [UserResolver, UserService, UserTransformer,UserVerificationCodeService, UserDataLoader],
  exports: [UserService, UserTransformer, UserVerificationCodeService, UserDataLoader],
})
export class UserModule {}
