import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HelpService {
  public trimAllSpaces(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }
}
