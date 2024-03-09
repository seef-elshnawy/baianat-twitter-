import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SecurityGroupService } from './security-group.service';
import { SecurityGroup } from './entities/security-group.entity';


@Resolver(() => SecurityGroup)
export class SecurityGroupResolver {
  constructor(private readonly securityGroupService: SecurityGroupService) {}
}
