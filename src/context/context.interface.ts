import { User } from 'src/user/entities/user.entity';
import { Request } from 'express';

export const IContextAuthToken = 'IContextToken';

export interface IContextAuthService {
  getUserFromReqHeaders(req: Request): Promise<User>;
  hasPremission(premisson: string[], user: User): boolean;
  getAuth(request:Request) : string
}
