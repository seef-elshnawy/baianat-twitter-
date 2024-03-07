import { Inject, Injectable } from '@nestjs/common';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { IRepository } from 'src/common/database/repository.interface';
import { User } from '../entities/user.entity';
import { Repository } from 'src/common/database/database-repository.enum';
import { UserBoardInput } from '../dto/user-board.filter';
import { BaseHttpException } from 'src/common/exception/base-http.error';
import { ErrorCodeEnum } from 'src/common/exception/error-code.enum';
import { Op } from 'sequelize';
import { PaginationRes } from 'src/common/paginator/paginator.types';
import { UserBoardFilter } from '../dto/userboard.input';
import { PaginatorInput } from 'src/common/paginator/paginator.input';
import { HelpService } from 'src/common/utils/helper.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(Repository.UserRepository)
    private readonly userRepo: IRepository<User>,
    private helper: HelpService
  ) {}
  async usersBoard(
    filter:UserBoardFilter = {},
    paginate: PaginatorInput = {},
    currentUserId: string
  ):Promise<PaginationRes<User>>{
    return await this.userRepo.findPaginated(
      {
        id : {[Op.ne] : currentUserId},
        ...(filter.isBlocked !== undefined && {isBlocked:filter.isBlocked}),
        ...(filter.gender && {gender:filter.gender}),
        ...(filter.searchKey && {
            [Op.or]:[
              {fullName: {[Op.iLike]: `%${this.helper.trimAllSpaces(filter.searchKey)}%`}},
              {VerifiedPhone:{[Op.iLike]: `%${filter.searchKey}%`}}
            ]
        })
      },
      '-createdAt',
      paginate.page,
      paginate.limit
    )
  }
  async userOrError(input: UserBoardInput) {
    const user = await this.userRepo.findOne({ id: input.userId });
    if (!user) throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
    return user;
  }
  async userByNotVerifiedOrVerifiedNumber(phone: string) {
    const user = this.userRepo.findOne({
      where: {
        [Op.or]: [{ VerifiedPhone: phone }, { notVerifiedPhone: phone }],
      },
    });
    if (!user) throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
    return user;
  }
  create(createUserInput: CreateUserInput) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
