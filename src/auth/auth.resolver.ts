import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
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
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './guard/auth.guard';
import { Ctx } from 'type-graphql';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => GraphQLJSON)
  async register(@Args('input') input: RegisterInput, lang: langEnum.EN) {
    const value = await this.authService.register(input, lang);
    return value;
  }

  @Mutation(() => GqlBooleanResponse)
  async validateOtp(@Args('input') input: UserValideOtp, @Context() ctx) {
     return await this.authService.validateOtp(input, ctx.token);
  }

  @Mutation(() => GqlStringResponse)
  async signInUsingEmail(@Args('input') input: UserSignIn) {
    return await this.authService.signInWithEmailAndPassword(input);
  }
  @Mutation(() => GqlStringResponse)
  async validatePhoneNumber(@Args('phone') phone: string) {
    return await this.authService.validatePhoneNumber(phone);
  }
  
  @UseGuards(AuthGuard)
  @Query(() => gqlUserResponse)
  async getMe(@CurrentUser() user: User) {
    return user;
  }
}
