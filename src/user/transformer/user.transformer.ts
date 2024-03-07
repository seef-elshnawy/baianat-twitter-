import { Injectable } from '@nestjs/common';
import { HelpService } from 'src/common/utils/helper.service';
import { RegisterInput } from '../dto/register.input';
import { langEnum } from '../user.enum';
import { LongLatTransformerInput } from '../user.interface';
import { LocationType } from '../user.type';

@Injectable()
export class UserTransformer {
  constructor(private readonly helperService: HelpService) {}
  private LongLatTransformer(input: LongLatTransformerInput): LocationType {
    return {
      ...(input.long &&
        input.lat && { type: 'Point', coordinates: [input.long, input.lat] }),
    };
  }
  async registerAsUserInputTransformer(
    input: RegisterInput,
    favLang: langEnum,
  ) {
    return {
      ...input,
      favLang,
      fullName: input.firstName + ' ' + input.lastName,
      ...(input.lat &&
        input.long && {
          location: this.LongLatTransformer({
            lat: input.lat,
            long: input.long,
          }),
        }),
      notVerifiedPhone: input.phone,
      password: this.helperService.hashPassword(input.password),
      slug: this.helperService.slugify(
        `${input.firstName} - ${input.lastName || ''}`,
      ),
    };
  }
}
