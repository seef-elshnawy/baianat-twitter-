import { Inject, Injectable } from '@nestjs/common';
import { IRepository } from 'src/common/database/repository.interface';
import { User } from '../entities/user.entity';
import { Repository } from 'src/common/database/database-repository.enum';
import { UserBoardInput } from '../dto/user-board.filter';
import { BaseHttpException } from 'src/common/exception/base-http.error';
import { ErrorCodeEnum } from 'src/common/exception/error-code.enum';
import { Includeable, Op, WhereOptions } from 'sequelize';
import { PaginationRes } from 'src/common/paginator/paginator.types';
import { UserBoardFilter } from '../dto/userboard.input';
import { PaginatorInput } from 'src/common/paginator/paginator.input';
import { HelpService } from 'src/common/utils/helper.service';
import { SecurityGroup } from 'src/security-group/entities/security-group.entity';
import { UserVerificationCode } from '../entities/user-verification-code.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(Repository.UserRepository)
    private readonly userRepo: IRepository<User>,
    private helper: HelpService,
    @Inject(Repository.SecurityGroupRepository)
    private securityGroupRepo: IRepository<SecurityGroup>,
  ) {}
  async usersBoard(
    filter: UserBoardFilter = {},
    paginate: PaginatorInput = {},
    currentUserId: string,
  ): Promise<PaginationRes<User>> {
    return await this.userRepo.findPaginated(
      {
        id: { [Op.ne]: currentUserId },
        ...(filter.isBlocked !== undefined && { isBlocked: filter.isBlocked }),
        ...(filter.gender && { gender: filter.gender }),
        ...(filter.searchKey && {
          [Op.or]: [
            {
              fullName: {
                [Op.iLike]: `%${this.helper.trimAllSpaces(filter.searchKey)}%`,
              },
            },
            { email: { [Op.iLike]: `%${filter.searchKey}%` } },
            { VerifiedPhone: { [Op.iLike]: `%${filter.searchKey}%` } },
          ],
        }),
      },
      '-createdAt',
      paginate.page,
      paginate.limit,
    );
  }
  async userOrError(input: UserBoardInput) {
    const user = await this.userRepo.findOne({ id: input.userId });
    if (!user) throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
    return user;
  }
  async userByNotVerifiedOrVerifiedPhoneOrError(phone: string) {
    const user = this.userRepo.findOne({
      where: {
        [Op.or]: [{ VerifiedPhone: phone }, { notVerifiedPhone: phone }],
      },
    });
    if (!user) throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
    return user;
  }
  async superAdmins() {
    const superAdminRole = await this.securityGroupRepo.findOne({
      groupName: 'SuperAdmin',
    });
    if (!superAdminRole) return [];
    return await this.userRepo.findAll({ securityGroupId: superAdminRole.id });
  }
  async getValidUserOrError(
    filter: WhereOptions,
    joinedTables?: Includeable[],
  ): Promise<User> {
    const user = await this.userRepo.findOne(filter, joinedTables);
    if (!user) throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
    if (user.isBlocked) throw new BaseHttpException(ErrorCodeEnum.BLOCKED_USER);
    if (!user.VerifiedPhone)
      throw new BaseHttpException(ErrorCodeEnum.USER_PHONE_NOT_VERIFIED_YET);
    return user;
  }
  async getValidUserForLoginOrError(filter: WhereOptions): Promise<User> {
    const user = await this.userRepo.findOne(filter);
    if (!user) throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
    if (user.isBlocked) throw new BaseHttpException(ErrorCodeEnum.BLOCKED_USER);
    return user;
  }
  async errorIfUserWithEmailExists(email?: string) {
    if (email && (await this.userRepo.findOne({ VerifiedEmail: email })))
      throw new BaseHttpException(ErrorCodeEnum.EMAIL_ALREADY_EXISTS);
  }

  async errorIfUserWithVerifiedPhoneExists(phone?: string) {
    if (phone && (await this.userRepo.findOne({ VerifiedPhone: phone })))
      throw new BaseHttpException(ErrorCodeEnum.PHONE_ALREADY_EXISTS);
  }
  async userByNotVerifiedPhoneOrError(phone: string) {
    const user = await this.userRepo.findOne({ notVerifiedPhone: phone }, [
      UserVerificationCode,
    ]);
    if (!user) throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
    return user;
  }
  async userByVerifiedPhoneOrError(phone: string) {
    const user = await this.userRepo.findOne({ verifiedPhone: phone }, [
      UserVerificationCode,
    ]);
    if (!user) throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
    return user;
  }
  async errorIfOtherUserHasSameVerifiedPhone(
    phone: string,
    currentUserId: string,
  ) {
    const otherUser = await this.userRepo.findOne({
      VerifiedPhone: phone,
      id: { [Op.ne]: currentUserId },
    });
    if (otherUser)
      throw new BaseHttpException(ErrorCodeEnum.PHONE_ALREADY_EXISTS);
  }
  async deleteDuplicatedUsersAtNotVerifiedPhone(duplicatedPhone: string) {
    await this.userRepo.deleteAll({ notVerifiedPhone: duplicatedPhone });
  }

  async deleteDuplicatedUsersAtEmailsIfPhoneNotVerifiedYet(
    duplicatedEmail?: string,
  ) {
    if (duplicatedEmail) {
      const user = await this.userRepo.findOne({
        notVerifiedEmail: duplicatedEmail,
      });
      if (user && !user.VerifiedPhone) await user.destroy({ force: true });
    }
  }
}
