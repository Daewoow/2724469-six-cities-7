import { Expose } from 'class-transformer';
import { CityName, HousingType } from '../../../types';

export class OfferShortRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public housingType: HousingType;

  @Expose()
  public price: number;

  @Expose()
  public city: CityName;

  @Expose()
  public postDate: Date;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public previewImage: string;
}
