import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { UserService } from './Service/user.service';
import { User } from './entities/user.entity';
import { GraphQLJSON } from 'graphql-scalars';
import { IDataLoader } from 'src/common/dataloader/dataloader.interface';
import { gqlUserListResponse, gqlUserResponse } from './user.response';
import { UseGuards } from '@nestjs/common';
import { PremissonGuard } from 'src/auth/guard/premissons.guard';
import { UserPermissionsEnum } from 'src/security-group/security-group-premissions';
import { HasPremissons } from 'src/auth/auth.metadata';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  
  @HasPremissons(UserPermissionsEnum.READ_USERS)
  @UseGuards(PremissonGuard)
  @Query(() => gqlUserListResponse)
  async getUsers(@Args('page') page: number, @Args('limit') limit: number) {
    return await this.userService.getAllUser(page, limit);
  }
  
  @ResolveField(() => GraphQLJSON, {nullable:true})
  async getTweets(
    @Parent() user: User,
    @Context('loaders') dataloader: IDataLoader,
  ) {
    return await dataloader.userLoader.load(user.id);
  }
}
