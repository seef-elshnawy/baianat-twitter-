import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { MjmlService } from './mjmail.service';
import * as Handlebars from 'handlebars';

@Injectable()
export class MailService {
  constructor(
    private mailService: MailerService,
    private mjml: MjmlService,
  ) {}

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

  async sendEmailToAllUser(email: string, firstName:string) {
    await this.mailService.sendMail({
      to: email,
      subject: `hello ${firstName}`,
      template: './promotions',
    });
  }
}
