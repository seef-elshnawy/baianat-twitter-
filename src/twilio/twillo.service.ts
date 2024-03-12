import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
@Injectable()
export class TwilloService {
  constructor(private config: ConfigService) {}
  private twilloAccountSid = this.config.get('TWILIO_SID');
  private twilloToken = this.config.get('TWILIO_TOKEN');
  private twilloNumber = this.config.get('TWILIO_NUMBER');

  public client = twilio(this.twilloAccountSid, this.twilloToken);
  public async sendSms(to: string, body: string): Promise<void> {
    await this.client.messages.create({
      from: this.twilloNumber,
      to,
      body,
    });
  }
}
