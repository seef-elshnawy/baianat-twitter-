import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    await this.mailService.sendMail({
      to: user.notVerifiedEmail,
      subject: 'Welcome to Twitter! Confirm your Email',
      template: './confirmation',
      context: {
        user,
        token,
      },
    });
  }
}
