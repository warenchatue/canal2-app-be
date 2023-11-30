import { HttpException, NotFoundException } from '@nestjs/common';

export const sendError = (exception: any) => {
  console.error(exception);
  if (exception.status) throw exception;
  if (exception.name && exception.name === 'CastError') {
    throw new NotFoundException(exception.message);
  }
  throw new HttpException(exception, 500);
};

export function toBoolean(value: string): boolean {
  value = value.toLowerCase();

  return value === 'true' || value === '1' ? true : false;
}

/**
 * Parse any object to string value
 *
 * @param obj The object to parse
 * @returns The given object to string
 */
export const stringify = (obj: any) => JSON.stringify(obj);
/**
 * Generate a random String value
 *
 * @param length String length
 * @returns The generated string
 */
export const randSrt = (length = 7): string => {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let str = '';

  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
};

/**
 *
 * @param value
 * @returns the generated code
 */
export const genCode = (value: number, length = 4): string => {
  let newCode = value.toString();
  for (let i = 0; i < length - value.toString().length; i++) {
    newCode = '0' + newCode;
  }

  return newCode;
};

/** Convert number to currency */
export const toCurrency = ({
  amount,
  locale = 'fr-FR',
  name = 'XAF',
  isShort = false,
  isFull = false,
}) => {
  let sign = '';
  if (amount < 0) {
    amount = Math.abs(amount);
    sign = '-';
  }
  if (isShort == true) {
    let newAmount = 0;
    if (amount >= 1000000) {
      newAmount = amount / 1000000;
      return `${sign}${newAmount.toLocaleString(locale)} ${name}`.replace(
        ',00',
        '',
      );
    } else if (amount >= 1000) {
      newAmount = amount / 1000;
      return `${sign}${newAmount.toLocaleString(locale)} K`.replace(',00', '');
    } else if (amount >= 0) {
      return `${sign}${newAmount.toLocaleString(locale)} ${name}`;
    } else {
      return `${sign}${newAmount.toLocaleString(locale)} ${name}`;
    }
  } else if (isFull == true) {
    if (locale == null) {
      return `${sign}${amount.toLocaleString('fr-FR')} ${name}`
        .replace(',00', '')
        .replace('.00', '    ')
        .replace(',', ' ');
    } else {
      return `${sign}${amount.toLocaleString(locale)} ${name}`;
      // return `$sign${NumberFormat.simpleCurrency(locale: locale, name: name).format(amount)}`;
    }
  } else {
    if (amount >= 1000000) {
      const newAmount = amount / 1000000;
      return `${sign}${newAmount.toLocaleString(locale)} M FCFA"`.replace(
        ',00',
        '',
      );
    } else {
      return `${sign}${amount.toLocaleString(locale)} XAF"`;
    }
  }
};
