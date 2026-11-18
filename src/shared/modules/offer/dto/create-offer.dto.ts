import {
  CityName,
  HousingType,
  Amenity,
  Coordinates,
  getAllCityNames,
  getAllHousingTypes,
  getAllAmenities,
} from '../../../types/index.js';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateOfferValidationMessage } from './create-or-update-offer.messages.js';
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
import { Type } from 'class-transformer';

class CoordinatesDto {
  @IsNumber(
    {},
    { message: CreateOfferValidationMessage.latitude.invalidFormat },
  )
  public latitude: number;

  @IsNumber(
    {},
    { message: CreateOfferValidationMessage.longitude.invalidFormat },
  )
  public longitude: number;
}

export class CreateOfferDto {
  @MinLength(MIN_TITLE_LENGTH, {
    message: CreateOfferValidationMessage.title.minLength,
  })
  @MaxLength(MAX_TITLE_LENGTH, {
    message: CreateOfferValidationMessage.title.maxLength,
  })
  public title: string;

  @MinLength(MIN_DESCRIPTION_LENGTH, {
    message: CreateOfferValidationMessage.description.minLength,
  })
  @MaxLength(MAX_DESCRIPTION_LENGTH, {
    message: CreateOfferValidationMessage.description.maxLength,
  })
  public description: string;

  @IsDateString(
    {},
    { message: CreateOfferValidationMessage.postDate.invalidFormat },
  )
  public postDate: Date;

  @IsEnum(getAllCityNames(), {
    message: CreateOfferValidationMessage.city.invalid,
  })
  public city: CityName;

  @IsString({
    message: CreateOfferValidationMessage.previewImage.invalidFormat,
  })
  public previewImage: string;

  @IsArray({ message: CreateOfferValidationMessage.images.invalidFormat })
  @IsString({
    each: true,
    message: CreateOfferValidationMessage.images.invalidFormat,
  })
  @ArrayMinSize(OFFER_IMAGES_COUNT, {
    message: CreateOfferValidationMessage.images.minLength,
  })
  @ArrayMaxSize(OFFER_IMAGES_COUNT, {
    message: CreateOfferValidationMessage.images.maxLength,
  })
  public images: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsEnum(getAllHousingTypes(), {
    message: CreateOfferValidationMessage.type.invalid,
  })
  public housingType: HousingType;

  @IsInt({ message: CreateOfferValidationMessage.rooms.invalidFormat })
  @Min(MIN_ROOMS, { message: CreateOfferValidationMessage.rooms.minValue })
  @Max(MAX_ROOMS, { message: CreateOfferValidationMessage.rooms.maxValue })
  public rooms: number;

  @IsInt({ message: CreateOfferValidationMessage.guests.invalidFormat })
  @Min(MIN_GUESTS, { message: CreateOfferValidationMessage.guests.minValue })
  @Max(MAX_GUESTS, { message: CreateOfferValidationMessage.guests.maxValue })
  public guests: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(MIN_PRICE, { message: CreateOfferValidationMessage.price.minValue })
  @Max(MAX_PRICE, { message: CreateOfferValidationMessage.price.maxValue })
  public price: number;

  @IsArray({ message: CreateOfferValidationMessage.amenities.invalidFormat })
  @IsEnum(getAllAmenities(), {
    each: true,
    message: CreateOfferValidationMessage.amenities.invalidFormat,
  })
  public amenities: Amenity[];

  @IsMongoId({ message: CreateOfferValidationMessage.author.invalidId })
  public author: string;

  @ValidateNested()
  @Type(() => CoordinatesDto)
  public coordinates: Coordinates;
}
