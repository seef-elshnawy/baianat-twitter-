import { User } from 'src/user/entities/user.entity';
import { plural } from 'pluralize';
import { buildRepository } from './database-repository.builder';
import { UserVerificationCode } from 'src/user/entities/user-verification-code.entity';
import { SecurityGroup } from 'src/security-group/entities/security-group.entity';

export const model = [User, UserVerificationCode, SecurityGroup];
export const repositories = model.map((m) => ({
  provide: `${plural(m.name)}Repository`,
  useClass: buildRepository(m),
}));
