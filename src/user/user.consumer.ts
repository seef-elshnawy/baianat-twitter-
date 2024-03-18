import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { MailService } from 'src/mail/service/mail.service';
import { User } from './entities/user.entity';

@Processor('user')
export class UserConsumer {
  constructor(
    private mailService: MailService,
    @InjectQueue('user') private userQueue: Queue,
  ) {}
  @Process('user')
  async UserPipe(job: Job<{ users: User[] }>) {
    job.data.users.map(async (user) => {
      return await this.userQueue.add('sendEmails', {
        user,
      });
    });
  }
  @Process('sendEmails')
  async sendEmails(
    job: Job<{ user: { VerifiedEmail: string; firstName: string } }>,
  ) {
    await this.mailService.sendEmailToAllUser(
      job.data.user.VerifiedEmail,
      job.data.user.firstName,
    );
    return true;
  }
}
