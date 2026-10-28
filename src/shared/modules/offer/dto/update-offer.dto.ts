import {
  CityName,
  HousingType,
  Amenity,
  Coordinates,
} from '../../../types/index.js';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public postDate?: Date;
  public city?: CityName;
  public previewImage?: string;
  public images?: string[];
  public isPremium?: boolean;
  public housingType?: HousingType;
  public rooms?: number;
  public guests?: number;
  public price?: number;
  public amenities?: Amenity[];
  public coordinates?: Coordinates;
}
