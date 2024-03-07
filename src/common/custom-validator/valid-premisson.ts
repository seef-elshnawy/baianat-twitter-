import { registerDecorator } from 'class-validator';
import { premissons } from 'src/security-group/security-group-premissions';

function validPremission(value: string[]): boolean {
  return value.every((val) =>
    Object.values(premissons).find((arr) => arr.includes(val)),
  );
}

export function ValidPremissons() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ValidPremissons',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: string[]) {
          return validPremission(value);
        },
      },
    });
  };
}
