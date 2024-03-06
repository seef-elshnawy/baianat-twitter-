import { User } from './entities/user.entity';
import { UserVerificationCodeUseCaseEnum } from './user.enum';

export interface VerificationCodeAndExpirationDate {
  verificationCode: string;
  expiryDateAfterOneHour: Date;
}

export interface ValidVerificationCodeOrErrorInput {
  user?: User;
  verificationCode: string;
  useCase: UserVerificationCodeUseCaseEnum;
}

export interface DeleteVerificationCodeAndUpdateUserModelInput {
  user: User;
  useCase: UserVerificationCodeUseCaseEnum;
}
