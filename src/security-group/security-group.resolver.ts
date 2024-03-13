import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SecurityGroupService } from './security-group.service';
import { SecurityGroup } from './entities/security-group.entity';
import { gqlSecurityGroupResponse } from './premissons.response';
import { CreateSecurityGroupInput } from './dto/create-security-group.input';
import { AssignSecurityGroupToUsers } from './dto/assign-security-group-to-user';
import { GqlBooleanResponse } from 'src/common/graphql/graphql-response-type';
import { UnAssignSecurityGroupToUsersInput } from './dto/unassign-user-to-securitygroup';
import { DeleteSecurityGroupInput } from './dto/delete-security-group.input';
import { UpdateSecurityGroupInput } from './dto/update-security-group.input';
import { PremissonGuard } from 'src/auth/guard/premissons.guard';
import { UseGuards } from '@nestjs/common';
import { HasPremissons } from 'src/auth/auth.metadata';
import { SecurityGroupPermissionsEnum } from './security-group-premissions';

@Resolver(() => SecurityGroup)
export class SecurityGroupResolver {
  constructor(private readonly securityGroupService: SecurityGroupService) {}
  
  @HasPremissons(SecurityGroupPermissionsEnum.CREATE_SECURITY_GROUPS)
  @UseGuards(PremissonGuard)
  @Mutation(() => gqlSecurityGroupResponse)
  async createSecuritygroup(@Args('input') input: CreateSecurityGroupInput) {
    return await this.securityGroupService.createSecurityGroup(input);
  }
  // @Mutation(() => gqlSecurityGroupResponse)
  // async createSecuritygroupAdmin() {
  //   return await this.securityGroupService.createSecuritygroupSuperAdmin();
  // }

  @HasPremissons(SecurityGroupPermissionsEnum.ASSIGN_SECURITY_GROUPS_TO_USERS)
  @UseGuards(PremissonGuard)
  @Mutation(()=> GqlBooleanResponse)
  async assignSecurityGroupToUser(@Args('input') input:AssignSecurityGroupToUsers){
    return await this.securityGroupService.assignSecurityGroup(input)
  }

  @HasPremissons(SecurityGroupPermissionsEnum.UN_ASSIGN_SECURITY_GROUPS_TO_USERS)
  @UseGuards(PremissonGuard)
  @Mutation(()=> GqlBooleanResponse)
  async unAssignSecurityGroupToUser(@Args('input') input:UnAssignSecurityGroupToUsersInput){
    return await this.securityGroupService.unAssignSecurityGroup(input)
  }

  @HasPremissons(SecurityGroupPermissionsEnum.DELETE_SECURITY_GROUPS)
  @UseGuards(PremissonGuard)
  @Mutation(()=> GqlBooleanResponse)
  async deleteSecurityGroupToUser(@Args() input:DeleteSecurityGroupInput){
    return await this.securityGroupService.deleteSecurityGroup(input)
  }
  
  @HasPremissons(SecurityGroupPermissionsEnum.UPDATE_SECURITY_GROUPS)
  @UseGuards(PremissonGuard)
  @Mutation(()=> gqlSecurityGroupResponse)
  async updateSecurityGroupToUser(@Args('input') input:UpdateSecurityGroupInput){
    return await this.securityGroupService.updateSecurityGroup(input)
  }
}
