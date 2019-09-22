import { User } from '../entities/user.entity';
import { Request } from "express"
export interface UserAuthRequest extends Request {
  user: User // or any other type
}