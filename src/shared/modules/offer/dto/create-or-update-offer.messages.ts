import {
  MAX_DESCRIPTION_LENGTH,
  MAX_GUESTS,
  MAX_PRICE,
  MAX_ROOMS,
  MAX_TITLE_LENGTH,
  MIN_DESCRIPTION_LENGTH,
  MIN_GUESTS,
  MIN_PRICE,
  MIN_ROOMS,
  MIN_TITLE_LENGTH,
  OFFER_IMAGES_COUNT,
} from '../../../constants/index.js';

export const CreateOfferValidationMessage = {
  title: {
    minLength: `Заголовок должен содержать минимум ${MIN_TITLE_LENGTH} символов`,
    maxLength: `Заголовок не должен превышать ${MAX_TITLE_LENGTH} символов`,
  },
  description: {
    minLength: `Описание должно содержать минимум ${MIN_DESCRIPTION_LENGTH} символов`,
    maxLength: `Описание не должно превышать ${MAX_DESCRIPTION_LENGTH} символов`,
  },
  postDate: {
    invalidFormat: 'Дата публикации должна быть в формате ISO',
  },
  city: {
    invalid: 'Город должен быть одним из допустимых значений',
  },
  previewImage: {
    invalidFormat: 'Превью-изображение должно быть строкой',
  },
  images: {
    invalidFormat: 'Изображения должны быть массивом строк',
    minLength: `Должно быть ровно ${OFFER_IMAGES_COUNT} изображений`,
    maxLength: `Должно быть ровно ${OFFER_IMAGES_COUNT} изображений`,
  },
  isPremium: {
    invalidFormat: 'Поле isPremium должно быть булевым значением',
  },
  type: {
    invalid: 'Тип жилья должен быть одним из допустимых значений',
  },
  rooms: {
    invalidFormat: 'Количество комнат должно быть целым числом',
    minValue: `Количество комнат не может быть меньше ${MIN_ROOMS}`,
    maxValue: `Количество комнат не может превышать ${MAX_ROOMS}`,
  },
  guests: {
    invalidFormat: 'Количество гостей должно быть целым числом',
    minValue: `Количество гостей не может быть меньше ${MIN_GUESTS}`,
    maxValue: `Количество гостей не может превышать ${MAX_GUESTS}`,
  },
  price: {
    invalidFormat: 'Цена должна быть целым числом',
    minValue: `Цена не может быть меньше ${MIN_PRICE}`,
    maxValue: `Цена не может превышать ${MAX_PRICE}`,
  },
  amenities: {
    invalidFormat: 'Удобства должны быть массивом допустимых значений',
  },
  author: {
    invalidId: 'ID автора должен быть корректным MongoDB ObjectId',
  },
  latitude: {
    invalidFormat: 'Широта должна быть числом',
  },
  longitude: {
    invalidFormat: 'Долгота должна быть числом',
  },
  coordinates: {
    invalidFormat: 'Координаты должны быть объектом',
  },
} as const;
