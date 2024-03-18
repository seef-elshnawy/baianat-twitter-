import { Inject, Injectable } from '@nestjs/common';
import { CreateAppConfigrationInput } from './dto/create-app-configration.input';
import { UpdateAppConfigrationInput } from './dto/update-app-configration.input';
import { Repository } from 'src/common/database/database-repository.enum';
import { AppConfigration } from './entities/app-configration.entity';
import { IRepository } from 'src/common/database/repository.interface';
import { BaseHttpException } from 'src/common/exception/base-http.error';
import { ErrorCodeEnum } from 'src/common/exception/error-code.enum';
import { Op } from 'sequelize';
import { AppConfigurationInput } from './dto/app-configration-input.dto';

@Injectable()
export class AppConfigrationService {
  constructor(
    @Inject(Repository.AppConfigrationRepository)
    private readonly appConfigRepo: IRepository<AppConfigration>,
  ) {}
  async appConfigrationBoard() {
    return await this.appConfigRepo.findAll();
  }
  async createAppConfigrationBoard(
    input: CreateAppConfigrationInput,
  ): Promise<AppConfigration> {
    await this.checkIfConfigurationHasUniqueKeyOrError(input.key);
    return this.appConfigRepo.createOne({ ...input });
  }

  async appConfigurationValueByKey(key: string): Promise<String> {
    const config = await this.appConfigRepo.findOne({ key });
    return config !== null ? config.value : null;
  }
  async checkIfConfigurationHasUniqueKeyOrError(key: string) {
    const appConfigration = await this.appConfigRepo.findOne({ key });
    if (appConfigration)
      throw new BaseHttpException(
        ErrorCodeEnum.CONFIGURATION_SHOULD_HAS_UNIQUE_KEY,
      );
  }

  async updateConfigrationBoard(
    input: UpdateAppConfigrationInput,
  ): Promise<AppConfigration> {
    const config = await this.appConfigRepo.findOne({ id: input.appConfigId });
    if (!config)
      throw new BaseHttpException(ErrorCodeEnum.CONFIGURATION_NOT_EXISTS);
    if (input.key)
      await this.checkIfConfigurationHasSameKeyInAnotherInstance(
        input.key,
        input.appConfigId,
      );
    return await this.appConfigRepo.updateOneFromExistingModel(config, {
      ...input,
    });
  }
  async checkIfConfigurationHasSameKeyInAnotherInstance(
    key: string,
    appConfigrationId: string,
  ) {
    const appConfig = await this.appConfigRepo.findOne({
      key,
      id: { [Op.ne]: appConfigrationId },
    });
    if (appConfig)
      throw new BaseHttpException(
        ErrorCodeEnum.CONFIGURATION_SHOULD_HAS_UNIQUE_KEY,
      );
  }

  async checkIfConfigrationsExists(input: AppConfigurationInput) {
    const config = await this.appConfigRepo.findOne({
      [Op.or]: {
        ...(input.key ? [{ key: input.key }] : []),
        ...(input.appConfigurationId ? [{ id: input.appConfigurationId }] : []),
      },
    });
    if (!config)
      throw new BaseHttpException(ErrorCodeEnum.CONFIGURATION_NOT_EXISTS);
    return config;
  }
}
