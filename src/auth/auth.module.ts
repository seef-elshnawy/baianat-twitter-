import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { buildRepository } from 'src/common/database/database-repository.builder';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserTransformer } from 'src/user/transformer/user.transformer';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports:[UserModule, MailModule],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
