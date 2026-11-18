import { getAllUserTypes, UserType } from '../../../types/index.js';
import { IsEmail, IsEnum, IsString, Length, Matches } from 'class-validator';
import { CreateUserMessages } from './create-user.messages.js';
import {
  MAX_NAME_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_NAME_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../../../constants/constants.js';

export class CreateUserDto {
  @IsString({ message: CreateUserMessages.name.invalidFormat })
  @Length(MIN_NAME_LENGTH, MAX_NAME_LENGTH, {
    message: CreateUserMessages.name.lengthField,
  })
  public name: string;

  @IsEmail({}, { message: CreateUserMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: CreateUserMessages.avatarPath.invalidFormat })
  @Matches(/\.(jpg|png)$/i, {
    message: CreateUserMessages.avatarPath.invalidFormat,
  })
  public avatarPath: string;

  @IsString({ message: CreateUserMessages.password.invalidFormat })
  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, {
    message: CreateUserMessages.password.lengthField,
  })
  public password: string;

  @IsEnum(getAllUserTypes(), { message: CreateUserMessages.type.invalidFormat })
  public type: UserType;
}
