import { Expose } from 'class-transformer';
import {
  CityName,
  HousingType,
  Amenity,
  Coordinates,
  User,
} from '../../../types/index.js';

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

  @Expose()
  public author: User;

  @Expose()
  public coordinates: Coordinates;

  @Expose()
  public commentCount: number;

  @Expose()
  public rating: number;
}
