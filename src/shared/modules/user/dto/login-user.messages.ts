export const CreateLoginUserMessage = {
  email: {
    invalidFormat: 'Email должен быть корректным адресом',
    required: 'Email является обязательным полем',
  },
  password: {
    invalidFormat: 'Пароль должен быть строкой',
    required: 'Пароль является обязательным полем',
  },
} as const;
