import { BadRequestException, ForbiddenException } from '@nestjs/common';

export const MUST_BE_AUTHOR_EXP = new ForbiddenException('MUST_BE_AUTHOR');

// Forbidden exceptions
export const MUST_BE_ADMIN_EXP = new ForbiddenException('MUST_BE_ADMIN');
export const MUST_BE_MEMBER_EXP = new ForbiddenException('MUST_BE_MEMBER');
export const MUST_BE_VALIDATOR_EXP = new ForbiddenException(
  'MUST_BE_VALIDATOR',
);
export const NOT_UNCONFIRMED_EXP = new ForbiddenException('NOT_UNCONFIRMED');
export const ALREADY_MEMBER_EXP = new ForbiddenException('ALREADY_MEMBER');
