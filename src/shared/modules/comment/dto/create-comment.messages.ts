import {
  MAX_COMMENT_TEXT_LENGTH,
  MAX_RATING,
  MIN_COMMENT_TEXT_LENGTH,
  MIN_RATING,
} from '../../../constants/constants.js';

export const CreateCommentMessages = {
  text: {
    invalidFormat: 'Текст комментария должен быть строкой',
    lengthField: `Текст комментария должен быть от ${MIN_COMMENT_TEXT_LENGTH} до ${MAX_COMMENT_TEXT_LENGTH} символов`,
  },
  rating: {
    invalidFormat: 'Рейтинг должен быть числом',
    minValue: `Рейтинг не может быть меньше ${MIN_RATING}`,
    maxValue: `Рейтинг не может превышать ${MAX_RATING}`,
  },
  userId: {
    invalidFormat: 'ID пользователя должен быть корректным MongoDB ObjectId',
    required: 'ID пользователя является обязательным полем',
  },
  postDate: {
    invalidFormat: 'Дата публикации должна быть в формате ISO',
  },
} as const;
