import { registerEnumType } from '@nestjs/graphql';

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
registerEnumType(GenderEnum, { name: 'GenderEnum' });

export enum langEnum {
  AR = 'AR',
  EN = 'EN',
}
registerEnumType(langEnum, { name: 'langEnum' });

export enum DeviceEnum {
  DESKTOP = 'DESKTOP',
  IOS = 'IOS',
  ANDROID = 'ANDROID',
}
registerEnumType(DeviceEnum, { name: 'DeviceEnum' });

export enum UserVerificationCodeUseCaseEnum {
  PASSWORD_RESET = 'PASSWORD_RESET',
  PHONE_VERIFICATION = 'PHONE_VERIFICATION',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
}
registerEnumType(UserVerificationCodeUseCaseEnum, {
  name: 'UserVerificationCodeUseCaseEnum',
});
