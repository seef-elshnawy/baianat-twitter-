import { Injectable } from '@nestjs/common';
import { HelpService } from 'src/common/utils/helper.service';
import { RegisterInput } from '../dto/register.input';
import { langEnum } from '../user.enum';
import { LongLatTransformerInput } from '../user.interface';

@Injectable()
export class UserTransformer {
  constructor(private readonly helperService: HelpService) {}

  async registerAsUserInputTransformer(
    input: RegisterInput,
    favLang: langEnum,
  ) {
    return {
      ...input,
      favLang,
      fullName: input.firstName + ' ' + input.lastName,
      notVerifiedPhone: input.phone,
      VerifiedPhone: null,
      notVerifiedEmail: input.email,
      password: await this.helperService.hashPassword(input.password),
      slag: this.helperService.slugify(
        `${input.firstName} - ${input.lastName || ''}`,
      ),
    };
  }
}
