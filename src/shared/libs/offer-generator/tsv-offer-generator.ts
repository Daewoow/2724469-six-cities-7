import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import {
  MockServerData,
  getAllCityNames,
  getAllHousingTypes,
  getAllAmenities,
  getAllUserTypes,
  getDefaultCityCoordinates,
} from '../../types/index.js';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
  getRandomItemsCount,
  getRandomBoolean,
} from '../../helpers/index.js';
import {
  FIRST_WEEK_DAY,
  LAST_WEEK_DAY,
  OFFER_IMAGES_COUNT,
  MIN_RATING,
  MAX_RATING,
  RATING_DECIMAL_DIGITS,
  MIN_ROOMS,
  MAX_ROOMS,
  MIN_GUESTS,
  MAX_GUESTS,
  MIN_PRICE,
  MAX_PRICE,
  DEFAULT_COMMENT_COUNT,
} from '../../constants/index.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const createdDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const city = getRandomItem<string>(getAllCityNames());
    const previewImage = getRandomItem<string>(this.mockData.offerImages);
    const images = getRandomItemsCount<string>(
      this.mockData.offerImages,
      OFFER_IMAGES_COUNT,
    ).join(';');
    const isPremium = getRandomBoolean().toString();
    const isFavorite = getRandomBoolean().toString();
    const rating = generateRandomValue(
      MIN_RATING,
      MAX_RATING,
      RATING_DECIMAL_DIGITS,
    ).toString();
    const housingType = getRandomItem<string>(getAllHousingTypes());
    const rooms = generateRandomValue(MIN_ROOMS, MAX_ROOMS).toString();
    const guests = generateRandomValue(MIN_GUESTS, MAX_GUESTS).toString();
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const amenities = getRandomItems<string>(getAllAmenities()).join(';');
    const author = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const password = getRandomItem<string>(this.mockData.passwords);
    const type = getRandomItem<string>(getAllUserTypes());
    const commentCount = DEFAULT_COMMENT_COUNT;
    const coords = getDefaultCityCoordinates(city);
    const coordsString = [coords.latitude, coords.longitude].join(';');

    return [
      title,
      description,
      createdDate,
      city,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      housingType,
      rooms,
      guests,
      price,
      amenities,
      author,
      email,
      avatar,
      password,
      type,
      commentCount,
      coordsString,
    ].join('\t');
  }
}
