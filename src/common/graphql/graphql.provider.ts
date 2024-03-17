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
import { DataloaderService } from '../dataloader/dataloader.service';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(
    @Inject(IContextAuthToken)
    private readonly authService: IContextAuthService,
    @Inject(DataloaderService) private dataloaderService: DataloaderService,
  ) {}

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
        if (extra && extra.currentUser) currentUser = extra.currentUser;
        else
          currentUser = await this.authService.getUserFromReqHeaders(
            <Request>req,
          );
        let locale = this.authService.getLocale(req);
        const token = await this.authService.getAuth(req);
        return {
          req,
          currentUser,
          token,
          loaders: this.dataloaderService.createLoaders(),
          lang: locale.lang,
        };
      },
    };
  }
}
