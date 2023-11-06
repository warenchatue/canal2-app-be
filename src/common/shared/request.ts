import { Request } from 'express';
import { UserDocument } from 'src/features/users/entities/user.entity';

export interface URequest extends Request {
  user: UserDocument;
}
