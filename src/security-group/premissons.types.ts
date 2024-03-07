import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType()
export class PremissonsGroups {
  @IsString()
  @Field(() => String)
  groupName: string;

  @Field(() => [String])
  premissons: string[];
}
