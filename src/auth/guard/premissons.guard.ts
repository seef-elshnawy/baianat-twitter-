import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { BaseHttpException } from 'src/common/exception/base-http.error';
import { ErrorCodeEnum } from 'src/common/exception/error-code.enum';
import {
  IContextAuthService,
  IContextAuthToken,
} from 'src/context/context.interface';

@Injectable()
export class PremissonGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(IContextAuthToken)
    private readonly authService: IContextAuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const premissons = this.reflector.get<string[]>(
      'premissons',
      context.getHandler(),
    );
    const ctx = GqlExecutionContext.create(context);
    const { currentUser } = ctx.getContext();
    if (!currentUser) throw new BaseHttpException(ErrorCodeEnum.UNAUTHORIZED);
    if (
      premissons &&
      premissons.length &&
      this.authService.hasPremission(premissons, currentUser)
    )
      throw new BaseHttpException(ErrorCodeEnum.UNAUTHORIZED);
    return true;
  }
}
