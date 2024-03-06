import { User } from 'src/user/entities/user.entity';
import { plural } from 'pluralize';
import { buildRepository } from './database-repository.builder';
import { UserVerificationCode } from 'src/user/entities/user-verification-code.entity';

export const model = [User, UserVerificationCode];
export const repositories = model.map((m) => ({
  provide: `${plural(m.name)}Repository`,
  useClass: buildRepository(m),
}));
