import { generateGqlPaginationResponseType, generateGqlResponseType } from "src/common/graphql/graphql-response-type";
import { Tweet } from "./entities/tweet.entity";


export const GqlTweetResponse = generateGqlResponseType(Tweet)
export const GqlTweetPaginateResponse = generateGqlResponseType(Array(Tweet))