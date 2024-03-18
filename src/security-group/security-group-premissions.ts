import { PremissonsGroups } from './premissons.types';

export enum UserPermissionsEnum {
  READ_USERS = 'READ_USERS',
  UPDATE_USERS = 'UPDATE_USERS',
  CREATE_USERS = 'CREATE_USERS',
  DELETE_USERS = 'DELETE_USERS',
  SEND_EMAILS = 'SEND_EMAILS',
}

export enum SecurityGroupPermissionsEnum {
  READ_SECURITY_GROUPS = 'READ_SECURITY_GROUPS',
  UPDATE_SECURITY_GROUPS = 'UPDATE_SECURITY_GROUPS',
  CREATE_SECURITY_GROUPS = 'CREATE_SECURITY_GROUPS',
  DELETE_SECURITY_GROUPS = 'DELETE_SECURITY_GROUPS',
  ASSIGN_SECURITY_GROUPS_TO_USERS = 'ASSIGN_SECURITY_GROUPS_TO_USERS',
  UN_ASSIGN_SECURITY_GROUPS_TO_USERS = 'UN_ASSIGN_SECURITY_GROUPS_TO_USERS',
}

export enum NotificationPermissionsEnum {
  SEND_NOTIFICATIONS = 'SEND_NOTIFICATIONS',
}

export enum AppConfigurationPermissionsEnum {
  READ_APP_CONFIGURATION = 'READ_APP_CONFIGURATION',
  UPDATE_APP_CONFIGURATION = 'UPDATE_APP_CONFIGURATION',
  CREATE_APP_CONFIGURATION = 'CREATE_APP_CONFIGURATION',
}

export enum WithdrawRequestPermissionsEnum {
  READ_WITHDRAW_REQUEST = 'READ_WITHDRAW_REQUEST',
  UPDATE_WITHDRAW_REQUEST = 'UPDATE_WITHDRAW_REQUEST',
  CREATE_WITHDRAW_REQUEST = 'CREATE_WITHDRAW_REQUEST',
  DELETE_WITHDRAW_REQUEST = 'DELETE_WITHDRAW_REQUEST',
}

export enum StatisticsPermissionsEnum {
  READ_STATISTICS = 'READ_STATISTICS',
}

export enum BankInformationPermissionsEnum {
  READ_BANK_INFORMATIONS = 'READ_BANK_INFORMATIONS',
  UPDATE_BANK_INFORMATIONS = 'UPDATE_BANK_INFORMATIONS',
  CREATE_BANK_INFORMATIONS = 'CREATE_BANK_INFORMATIONS',
  DELETE_BANK_INFORMATIONS = 'DELETE_BANK_INFORMATIONS',
}

export enum TWEETPermissionsEnum {
  READ_TWEET = 'READ_TWEET',
  UPDATE_TWEET = 'UPDATE_TWEET',
  CREATE_TWEET = 'CREATE_TWEET',
  DELETE_TWEET = 'DELETE_TWEET',
}

export const premissons = {
  users: Object.keys(UserPermissionsEnum),
  securityGroup: Object.keys(SecurityGroupPermissionsEnum),
  notifications: Object.keys(NotificationPermissionsEnum),
  appConfig: Object.keys(AppConfigurationPermissionsEnum),
  withdraw: Object.keys(WithdrawRequestPermissionsEnum),
  statics: Object.keys(StatisticsPermissionsEnum),
  bankInformition: Object.keys(BankInformationPermissionsEnum),
  tweets: Object.keys(TWEETPermissionsEnum),
};

export function getGroupedPremissons(): PremissonsGroups[] {
  let returnedPremissons: PremissonsGroups[] = [];
  let premissonGroup: PremissonsGroups;
  for (let key in premissons) {
    premissonGroup = {
      groupName: key,
      premissons: premissons[key],
    };
    returnedPremissons.push(premissonGroup);
  }
  return returnedPremissons;
}

export function getAllPremissons() {
  return Object.values(premissons).reduce((total, value) => {
    total.push(...value);
    return total;
  }, []);
}
