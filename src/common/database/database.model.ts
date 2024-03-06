import { User } from 'src/user/entities/user.entity';
import { plural } from 'pluralize';
import { buildRepository } from './database-repository.builder';

export const model = [User];
export const repositories = model.map((m) => ({
  provide: `${plural(m.name)}Repository`,
  useClass: buildRepository(m),
}));
