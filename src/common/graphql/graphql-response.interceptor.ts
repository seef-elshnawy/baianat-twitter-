import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { IGqlSucessResponse } from './graphql-response-type';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class GqlResponseInterceptor<T>
  implements NestInterceptor<T, IGqlSucessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IGqlSucessResponse<T>> {
    console.log('interceptor running');
    return next.handle().pipe(
      map((res) => {
        return {
          data: res,
          code: 200,
          success: true,
          message: 'Operation done successfully',
        };
      }),
    );
  }
}
