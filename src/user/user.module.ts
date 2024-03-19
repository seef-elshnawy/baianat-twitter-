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
import { BullModule } from '@nestjs/bull';
import { UserConsumer } from './user.consumer';
import { UserController } from './user.controller';

@Module({
  imports: [
    HelperModule,
    MailModule,
    BullModule.registerQueue({
      configKey: 'config_queue',
      name: 'user',
    }),
  ],
  providers: [
    UserResolver,
    UserService,
    UserTransformer,
    UserVerificationCodeService,
    UserDataLoader,
    UserConsumer
  ],
  controllers:[UserController],
  exports: [
    UserService,
    UserTransformer,
    UserVerificationCodeService,
    UserDataLoader,
  ],
})
export class UserModule {}
