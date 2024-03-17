import { i18Errors } from './i18-error';

export class MessageSource {
  getMessage(errorKey: string, lang?: string, params?) {
    if (!lang) lang = 'en';
    let localizedMessage: string =
      i18Errors[lang.toLocaleLowerCase()][errorKey];
    for (const key in params) {
        localizedMessage = localizedMessage.replace(`{${key}}`, params[key])
    }
    return localizedMessage
  }
}
