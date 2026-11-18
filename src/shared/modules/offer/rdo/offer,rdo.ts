import { Expose, Type } from 'class-transformer';
import {
  CityName,
  HousingType,
  Amenity,
  Coordinates,
} from '../../../types/index.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export class OfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public postDate: Date;

  @Expose()
  public city: CityName;

  @Expose()
  public previewImage: string;

  @Expose()
  public images: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public housingType: HousingType;

  @Expose()
  public rooms: number;

  @Expose()
  public guests: number;

  @Expose()
  public price: number;

  @Expose()
  public amenities: Amenity[];

  @Expose({ name: 'author' })
  @Type(() => UserRdo)
  public author: UserRdo;

  @Expose()
  public coordinates: Coordinates;

  @Expose()
  public commentCount: number;

  @Expose()
  public rating: number;
}
