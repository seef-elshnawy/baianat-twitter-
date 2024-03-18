import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AppConfigrationService } from './app-configration.service';
import { AppConfigration } from './entities/app-configration.entity';
import { CreateAppConfigrationInput } from './dto/create-app-configration.input';
import { UpdateAppConfigrationInput } from './dto/update-app-configration.input';
import {
  GqlAppConfigurationArrayResponse,
  GqlAppConfigurationResponse,
} from './app-configration.response';
import { UseGuards } from '@nestjs/common';
import { PremissonGuard } from 'src/auth/guard/premissons.guard';
import { HasPremissons } from 'src/auth/auth.metadata';
import { AppConfigurationPermissionsEnum } from 'src/security-group/security-group-premissions';
import { AppConfigurationInput } from './dto/app-configration-input.dto';

@Resolver(() => AppConfigration)
export class AppConfigrationResolver {
  constructor(
    private readonly appConfigrationService: AppConfigrationService,
  ) {}

  @HasPremissons(AppConfigurationPermissionsEnum.CREATE_APP_CONFIGURATION)
  @UseGuards(PremissonGuard)
  @Mutation(() => GqlAppConfigurationResponse)
  async createAppConfigration(
    @Args('input') createAppConfigInput: CreateAppConfigrationInput,
  ) {
    return await this.appConfigrationService.createAppConfigrationBoard(
      createAppConfigInput,
    );
  }

  @HasPremissons(AppConfigurationPermissionsEnum.READ_APP_CONFIGURATION)
  @UseGuards(PremissonGuard)
  @Query(() => GqlAppConfigurationArrayResponse)
  async appConfigurationsBoard() {
    return await this.appConfigrationService.appConfigrationBoard();
  }

  @HasPremissons(AppConfigurationPermissionsEnum.READ_APP_CONFIGURATION)
  @UseGuards(PremissonGuard)
  @Query(() => AppConfigration, { name: 'appConfigration' })
  async appConfigurationBoard(@Args('input') input: AppConfigurationInput) {
    return await this.appConfigrationService.checkIfConfigrationsExists(input);
  }

  @HasPremissons(AppConfigurationPermissionsEnum.UPDATE_APP_CONFIGURATION)
  @UseGuards(PremissonGuard)
  @Mutation(() => AppConfigration)
  async updateAppConfigration(
    @Args('input') updateAppConfigrationInput: UpdateAppConfigrationInput,
  ) {
    return await this.appConfigrationService.updateConfigrationBoard(
      updateAppConfigrationInput,
    );
  }

  // @Mutation(() => AppConfigration)
  // removeAppConfigration(@Args('id', { type: () => Int }) id: number) {
  // }
}
