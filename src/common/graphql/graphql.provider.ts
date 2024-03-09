import { ApolloDriverConfig } from '@nestjs/apollo';
import { Inject, Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { join } from 'path';
import {
  IContextAuthService,
  IContextAuthToken,
} from 'src/context/context.interface';
import { User } from 'src/user/entities/user.entity';
import { Request } from 'express';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  @Inject(IContextAuthToken) private readonly authService: IContextAuthService;

  createGqlOptions(): ApolloDriverConfig {
    return {
      playground: true,
      introspection: true,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      cache: 'bounded',
      persistedQueries: false,
      csrfPrevention: true,
      context: async ({ req, extra }) => {
        let currentUser: User;
        console.log(extra, 'extra');
        if (extra && extra.currentUser) currentUser = extra.currentUser;
        else
          currentUser = await this.authService.getUserFromReqHeaders(
            <Request>req,
          );
        return {
          req,
          currentUser,
        };
      },
    };
  }
}
