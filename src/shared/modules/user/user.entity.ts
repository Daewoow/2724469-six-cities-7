import {
  defaultClasses,
  getModelForClass,
  prop,
  modelOptions,
} from '@typegoose/typegoose';
import { getAllUserTypes, User, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';
import {
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
  DEFAULT_AVATAR_PATH,
} from '../../constants/index.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
  },
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({
    required: true,
    default: '',
    minlength: [
      MIN_NAME_LENGTH,
      `Минимальная длина имени: ${MIN_NAME_LENGTH}.`,
    ],
    maxlength: [
      MAX_NAME_LENGTH,
      `Максимальная длина имени: ${MAX_NAME_LENGTH}.`,
    ],
    trim: true,
  })
  public name: string;

  @prop({
    unique: true,
    required: true,
    match: [
      /^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      'Пожалуйста, укажите корректный email.',
    ],
    trim: true,
    lowercase: true,
  })
  public email: string;

  @prop({
    required: false,
    default: DEFAULT_AVATAR_PATH,
    match: [/\.(jpg|png)$/i, 'Аватар должен быть в формате JPG или PNG.'],
  })
  public avatarPath: string;

  @prop({ required: true })
  private password?: string;

  @prop({
    required: true,
    type: () => String,
    enum: getAllUserTypes(),
  })
  public type: UserType;

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatarPath = userData.avatarPath;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
