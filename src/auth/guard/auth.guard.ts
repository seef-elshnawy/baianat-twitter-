import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { BaseHttpException } from 'src/common/exception/base-http.error';
import { ErrorCodeEnum } from 'src/common/exception/error-code.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { currentUser } = ctx.getContext();
    if (!currentUser) throw new BaseHttpException(ErrorCodeEnum.UNAUTHORIZED);
    if (currentUser.isBlocked)
      throw new BaseHttpException(ErrorCodeEnum.BLOCKED_USER);
    if (!currentUser.VerifiedEmail)
      throw new BaseHttpException(ErrorCodeEnum.USER_EMAIL_IS_NOT_VERIFIED_YET);
    return true;
  }
}
