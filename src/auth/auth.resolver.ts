import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { gqlUserResponse } from 'src/user/user.response';
import { RegisterInput } from 'src/user/dto/register.input';
import { langEnum } from 'src/user/user.enum';
import { GraphQLJSON } from 'graphql-scalars';
import {
  GqlBooleanResponse,
  GqlStringResponse,
} from 'src/common/graphql/graphql-response-type';
import { UserValideOtp } from 'src/user/dto/user.valide-otp';
import { UserSignIn } from 'src/user/dto/user.signin';
import { CurrentUser } from './decorator/user.decorator';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => GraphQLJSON)
  async register(@Args('input') input: RegisterInput, lang: langEnum.EN) {
    const value = await this.authService.register(input, lang);
    return value;
  }

  @Mutation(() => GqlBooleanResponse)
  async validateOtp(@Args('input') input: UserValideOtp) {
    return await this.authService.validateOtp(input);
  }

  @Mutation(() => GqlStringResponse)
  async signInUsingEmail(@Args('input') input: UserSignIn) {
    return await this.authService.signInWithEmailAndPassword(input);
  }

  @Query(() => gqlUserResponse)
  async getMe(@CurrentUser() user: User) {
    return user;
  }
}
