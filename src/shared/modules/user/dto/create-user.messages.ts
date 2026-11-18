import {
  MAX_NAME_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_NAME_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../../../constants/constants.js';

export const CreateUserMessages = {
  name: {
    invalidFormat: 'Имя должно быть строкой',
    lengthField: `Имя должно быть от ${MIN_NAME_LENGTH} до ${MAX_NAME_LENGTH} символов`,
    required: 'Имя является обязательным полем',
  },
  email: {
    invalidFormat: 'Email должен быть корректным email-адресом',
    required: 'Email является обязательным полем',
  },
  avatarPath: {
    invalidFormat: 'Аватар должен быть изображением в формате .jpg или .png',
  },
  password: {
    invalidFormat: 'Пароль должен быть строкой',
    lengthField: `Пароль должен быть от ${MIN_PASSWORD_LENGTH} до ${MAX_PASSWORD_LENGTH} символов`,
    required: 'Пароль является обязательным полем',
  },
  type: {
    invalidFormat: 'Тип пользователя должен быть одним из допустимых значений',
    required: 'Тип пользователя является обязательным полем',
  },
} as const;
