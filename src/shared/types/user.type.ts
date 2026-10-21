import { UserType } from './user-types.js';

export type User = {
  name: string;
  email: string;
  avatarPath: string;
  type: UserType;
};
