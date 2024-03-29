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
import { Category } from '../entities/category.entity';
import { MailService } from 'src/mail/service/mail.service';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class UserService {
  constructor(
    @Inject(Repository.UserRepository)
    private readonly userRepo: IRepository<User>,
    private helper: HelpService,
    @Inject(Repository.SecurityGroupRepository)
    private securityGroupRepo: IRepository<SecurityGroup>,
    @Inject(Repository.CategoryRepository)
    private categoryRepo: IRepository<Category>,
    @InjectQueue('user') private userQueue: Queue,
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
      paginate.page,
      paginate.limit,
      '-createdAt',
    );
  }
  async getAllUser(page: number, limit: number) {
    return await this.userRepo.findPaginated({}, page, limit);
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
  async validePassworOrError(hashPassword: string, password: string) {
    const valide = await this.helper.validPassword(hashPassword, password);
    if (!valide) throw new BaseHttpException(ErrorCodeEnum.WRONG_PASSWORD);
    return password;
  }

  async addFollow(me: User, targetUserId: string) {
    if (targetUserId === me.id)
      throw new BaseHttpException(ErrorCodeEnum.YOU_CANT_ADD_YOURSELF);
    const targetUser = await this.userRepo.findOne({ id: targetUserId });
    if (!targetUser)
      throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
    let followings: string[] = me.Followings.concat(targetUser.id);
    let followers: string[] = targetUser.Followers.concat(me.id);
    if (
      me.Followings.includes(targetUser.id) ||
      targetUser.Followers.includes(me.id)
    )
      throw new BaseHttpException(ErrorCodeEnum.ALREADY_FOLLOW_THIS_USER);
    await targetUser.update({
      Followers: followers ? followers : [me.id],
    });
    await this.userRepo.updateAll(
      { id: me.id },
      { Followings: followings ? followings : [targetUser.id] },
    );
    return true;
  }

  async addCategory(categoryName: string) {
    const category = await this.categoryRepo.createOne({
      category: categoryName,
    });
    return category;
  }
  async sendMailToUsers() {
    const users = await this.userRepo.findAll(
      {
        VerifiedEmail: { [Op.ne]: null },
      },
      [],
      '',
      ['VerifiedEmail', 'firstName'],
    );
    await this.userQueue.add('user', {
      users,
    });
    return true;
  }
}
