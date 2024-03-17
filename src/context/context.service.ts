import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { IContextAuthService } from './context.interface';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { User } from 'src/user/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { authTokenPayload } from 'src/auth/dto/auth-token-payload';
import { Repository } from 'src/common/database/database-repository.enum';
import { IRepository } from 'src/common/database/repository.interface';
import { SecurityGroup } from 'src/security-group/entities/security-group.entity';
import { langEnum } from 'src/user/user.enum';
import { isISO31661Alpha2 } from 'class-validator';
@Injectable()
export class ContextService implements IContextAuthService {
  constructor(
    private config: ConfigService,
    @Inject(Repository.UserRepository)
    private readonly userRepo: IRepository<User>,
  ) {}
  getLocale(req: Request): { lang: langEnum; country: string } {
    if (!req) return { lang: langEnum.AR, country: 'EG' };
    let locale = <string>req.headers.lang || 'eg-en';
    let country = locale.split('-')[0].toUpperCase();
    if (!country || !isISO31661Alpha2(country)) country = 'EG';
    let lang = locale.split('-')[1] === 'ar' ? langEnum.AR : langEnum.EN;
    return { lang, country };
  }
  getAuth(req: Request): string {
    if (
      req &&
      req.headers &&
      (req.headers.authorization || req.headers.Autorization)
    ) {
      let auth: string;
      if (req.headers.authorization) auth = req.headers.authorization;
      if (req.headers.Authorization) auth = <string>req.headers.Authorization;
      return auth.split(' ')[1];
    }
    return null;
  }
  hasPremission(premisson: [], user: User): boolean {
    if (!user || !user.securityGroup || !user.securityGroup.id) return false;
    return user.securityGroup.premissons.includes(...premisson, '0');
  }
  async getUserFromReqHeaders(req: Request): Promise<User> {
    const token = this.getAuth(req);
    if (!token) return null;
    let { userId } = <authTokenPayload>(
      (<unknown>jwt.verify(token, this.config.get('JWT_SECRET')))
    );
    if (!userId) return null;
    const user = await this.userRepo.findOne({ id: userId }, [SecurityGroup]);
    return user ? (user.toJSON() as User) : null;
  }
}
