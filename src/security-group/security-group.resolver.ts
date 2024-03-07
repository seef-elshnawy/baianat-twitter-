import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SecurityGroupService } from './security-group.service';
import { SecurityGroup } from './entities/security-group.entity';
import { CreateSecurityGroupInput } from './dto/create-security-group.input';
import { UpdateSecurityGroupInput } from './dto/update-security-group.input';

@Resolver(() => SecurityGroup)
export class SecurityGroupResolver {
  constructor(private readonly securityGroupService: SecurityGroupService) {}

  @Mutation(() => SecurityGroup)
  createSecurityGroup(@Args('createSecurityGroupInput') createSecurityGroupInput: CreateSecurityGroupInput) {
    return this.securityGroupService.create(createSecurityGroupInput);
  }

  @Query(() => [SecurityGroup], { name: 'securityGroup' })
  findAll() {
    return this.securityGroupService.findAll();
  }

  @Query(() => SecurityGroup, { name: 'securityGroup' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.securityGroupService.findOne(id);
  }

  @Mutation(() => SecurityGroup)
  updateSecurityGroup(@Args('updateSecurityGroupInput') updateSecurityGroupInput: UpdateSecurityGroupInput) {
    return this.securityGroupService.update(updateSecurityGroupInput.id, updateSecurityGroupInput);
  }

  @Mutation(() => SecurityGroup)
  removeSecurityGroup(@Args('id', { type: () => Int }) id: number) {
    return this.securityGroupService.remove(id);
  }
}
