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

@Injectable()
export class UserService {
  constructor(
    @Inject(Repository.UserRepository)
    private readonly userRepo: IRepository<User>,
  ) {}
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
