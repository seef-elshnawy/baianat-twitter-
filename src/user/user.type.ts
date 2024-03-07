import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class LocationType {
  @Field()
  type: string;
  @Field(() => [Float])
  coordinates: number[];
}
