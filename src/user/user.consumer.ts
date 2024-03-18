import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from 'src/mail/service/mail.service';
import { User } from './entities/user.entity';

@Processor('user')
export class UserConsumer {
  constructor(private mailService: MailService) {}

  @Process('sendEmails')
  async sendEmails(job: Job<{ email: string; firstName: string }>) {
    await this.mailService.sendEmailToAllUser(
      job.data.email,
      job.data.firstName,
    );
    return true;
  }
}
