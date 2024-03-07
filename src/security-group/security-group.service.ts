import { Inject, Injectable } from '@nestjs/common';
import { CreateSecurityGroupInput } from './dto/create-security-group.input';
import { UpdateSecurityGroupInput } from './dto/update-security-group.input';
import { SecurityGroup } from './entities/security-group.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'src/common/database/database-repository.enum';
import { IRepository } from 'src/common/database/repository.interface';
import { BaseHttpException } from 'src/common/exception/base-http.error';
import { ErrorCodeEnum } from 'src/common/exception/error-code.enum';
import { Op } from 'sequelize';
import { AssignSecurityGroupToUsers } from './dto/assign-security-group-to-user';
import { UnAssignSecurityGroupToUsersInput } from './dto/unassign-user-to-securitygroup';
import { DeleteSecurityGroupInput } from './dto/delete-security-group.input';

@Injectable()
export class SecurityGroupService {
  constructor(
    @Inject(Repository.SecurityGroupRepository)
    private securityGroupRepo: IRepository<SecurityGroup>,
    @Inject(Repository.UserRepository) private userRepo: IRepository<User>,
  ) {}
  async createSecurityGroup(
    input: CreateSecurityGroupInput,
  ): Promise<SecurityGroup> {
    const otherSecurityGroupWithSamename = await this.securityGroupRepo.findOne(
      {
        groupName: input.groupName,
      },
    );
    if (otherSecurityGroupWithSamename)
      throw new BaseHttpException(
        ErrorCodeEnum.SECURITY_GROUP_NAME_ALREADY_EXISTS,
      );
    return await this.securityGroupRepo.createOne(input);
  }
  async updateSecurityGroup(
    input: UpdateSecurityGroupInput,
  ): Promise<SecurityGroup> {
    const securityGroup = await this.SecurityGroupOrError(
      input.securityGroupId,
    );
    const otherSecurityGroupWithSameName = this.securityGroupRepo.findOne({
      id: { [Op.ne]: input.securityGroupId },
      groupName: input.groupName,
    });
    if (otherSecurityGroupWithSameName)
      throw new BaseHttpException(
        ErrorCodeEnum.SECURITY_GROUP_NAME_ALREADY_EXISTS,
      );
    return await this.securityGroupRepo.updateOneFromExistingModel(
      securityGroup,
      input,
    );
  }
  async SecurityGroupOrError(SecurityGroupId: string): Promise<SecurityGroup> {
    const securityGroup = await this.securityGroupRepo.findOne({
      id: SecurityGroupId,
    });
    if (!securityGroup)
      throw new BaseHttpException(ErrorCodeEnum.SECURITY_GROUP_DOES_NOT_EXIST);
    return securityGroup;
  }

  async assignSecurityGroup(input: AssignSecurityGroupToUsers) {
    const securityGroup = await this.SecurityGroupOrError(
      input.securityGroupId,
    );
    const users = await this.userRepo.findAll({
      id: { [Op.in]: input.usersIds },
    });
    if (users.length !== input.usersIds.length)
      throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
    await this.userRepo.updateAll(
      { id: { [Op.in]: input.usersIds } },
      { securityGroupId: input.securityGroupId },
    );
    return securityGroup;
  }

  async unAssignSecurityGroup(input: UnAssignSecurityGroupToUsersInput) {
    const user = await this.userRepo.findAll({
      id: { [Op.in]: input.usersIds },
    });
    if (user.length !== input.usersIds.length)
      throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
    await this.userRepo.updateAll(
      { id: { [Op.in]: input.usersIds } },
      { securityGroupId: null },
    );
    return true;
  }

  async securityGroups(): Promise<SecurityGroup[]> {
    return await this.securityGroupRepo.findAll();
  }
  async deleteSecurityGroup(input: DeleteSecurityGroupInput) {
    const securityGroup = await this.SecurityGroupOrError(
      input.securityGroupId,
    );
    if (securityGroup.groupName === 'SuperAdmin')
      throw new BaseHttpException(ErrorCodeEnum.CANT_DELETE_SUPER_ADMIN_GROUP);
    await this.securityGroupRepo.deleteAll({ id: input.securityGroupId });
    return true;
  }
}
