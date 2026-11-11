import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import {
  CityName,
  getAllCityNames,
  HousingType,
  getAllHousingTypes,
  Amenity,
  getAllAmenities,
  Coordinates,
} from '../../types/index.js';
import { UserEntity } from '../user/index.js';
import {
  MIN_TITLE_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_DESCRIPTION_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MIN_RATING,
  MAX_RATING,
  MIN_ROOMS,
  MAX_ROOMS,
  MIN_GUESTS,
  MAX_GUESTS,
  MIN_PRICE,
  MAX_PRICE,
  ZERO_COMMENTS,
} from '../../constants/index.js';

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
    trim: true,
    minlength: [
      MIN_TITLE_LENGTH,
      `Минимальная длина названия: ${MIN_TITLE_LENGTH}.`,
    ],
    maxlength: [
      MAX_TITLE_LENGTH,
      `Максимальная длина названия: ${MAX_TITLE_LENGTH}.`,
    ],
  })
  public title: string;

  @prop({
    required: true,
    trim: true,
    minlength: [
      MIN_DESCRIPTION_LENGTH,
      `Минимальная длина описания: ${MIN_DESCRIPTION_LENGTH}.`,
    ],
    maxlength: [
      MAX_DESCRIPTION_LENGTH,
      `Максимальная длина описания: ${MAX_DESCRIPTION_LENGTH}.`,
    ],
  })
  public description: string;

  @prop({ required: true })
  public postDate: Date;

  @prop({
    required: true,
    type: () => String,
    enum: getAllCityNames(),
  })
  public city: CityName;

  @prop({
    required: true,
    match: [
      /\.(jpg|png)$/i,
      'Превью изображения должно быть в формате JPG или PNG.',
    ],
  })
  public previewImage: string;

  @prop({
    required: true,
    type: () => [String],
  })
  public images: string[];

  @prop({ required: true, default: false })
  public isPremium: boolean;

  @prop({
    required: true,
    min: [MIN_RATING, `Рейтинг не может быть меньше ${MIN_RATING}.`],
    max: [MAX_RATING, `Рейтинг не может быть больше ${MAX_RATING}.`],
  })
  public rating: number;

  @prop({
    required: true,
    type: () => String,
    enum: getAllHousingTypes,
  })
  public housingType: HousingType;

  @prop({
    required: true,
    min: [MIN_ROOMS, `Количество комнат не может быть меньше ${MIN_ROOMS}.`],
    max: [MAX_ROOMS, `Количество комнат не может быть больше ${MAX_ROOMS}.`],
  })
  public rooms: number;

  @prop({
    required: true,
    min: [MIN_GUESTS, `Количество гостей не может быть меньше ${MIN_GUESTS}.`],
    max: [MAX_GUESTS, `Количество гостей не может быть больше ${MAX_GUESTS}.`],
  })
  public guests: number;

  @prop({
    required: true,
    min: [MIN_PRICE, `Стоимость не может быть меньше ${MIN_PRICE}.`],
    max: [MAX_PRICE, `Стоимость не может быть больше ${MAX_PRICE}.`],
  })
  public price: number;

  @prop({
    required: true,
    type: () => [String],
    enum: getAllAmenities,
  })
  public amenities: Amenity[];

  @prop({
    ref: 'UserEntity',
    required: true,
  })
  public author: Ref<UserEntity>;

  @prop({ required: true, default: ZERO_COMMENTS })
  public commentCount: number;

  @prop({
    required: true,
    type: () => Object,
  })
  public coordinates: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
