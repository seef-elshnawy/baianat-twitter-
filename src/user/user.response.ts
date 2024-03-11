import { generateGqlResponseType } from 'src/common/graphql/graphql-response-type';
import { User } from './entities/user.entity';
import { UserVerificationCode } from './entities/user-verification-code.entity';

export const gqlUserResponse = generateGqlResponseType(User);
export const gqlUserListResponse = generateGqlResponseType(Array(User));
