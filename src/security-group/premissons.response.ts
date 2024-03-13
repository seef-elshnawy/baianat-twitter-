import { generateGqlResponseType } from "src/common/graphql/graphql-response-type";
import { SecurityGroup } from "./entities/security-group.entity";


export const gqlSecurityGroupResponse= generateGqlResponseType(SecurityGroup)