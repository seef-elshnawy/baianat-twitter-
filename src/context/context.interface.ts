import { User } from 'src/user/entities/user.entity';
import { Request } from 'express';
import { langEnum } from 'src/user/user.enum';

export const IContextAuthToken = 'IContextToken';

export interface IContextAuthService {
  getUserFromReqHeaders(req: Request): Promise<User>;
  hasPremission(premisson: string[], user: User): boolean;
  getLocale(req: Request): { lang: langEnum; country: string };
  getAuth(request:Request) : string
}
