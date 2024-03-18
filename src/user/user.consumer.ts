import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from 'src/mail/service/mail.service';
import { User } from './entities/user.entity';

@Processor('user')
export class UserConsumer {
  constructor(private mailService: MailService) {}

  @Process('sendEmails')
  async sendEmails(job: Job<{ user: User }>) {
    await this.mailService.sendEmailToAllUser(job.data.user);
    return true
  }
}
