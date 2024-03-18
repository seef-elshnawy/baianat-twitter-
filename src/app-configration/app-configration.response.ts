import { generateGqlResponseType } from 'src/common/graphql/graphql-response-type';
import { AppConfigration } from './entities/app-configration.entity';

export const GqlAppConfigurationResponse =
  generateGqlResponseType(AppConfigration);
export const GqlAppConfigurationArrayResponse = generateGqlResponseType(
  Array(AppConfigration),
  true,
);
