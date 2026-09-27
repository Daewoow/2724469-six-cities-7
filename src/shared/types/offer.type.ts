import { CityName } from "./city-name.enum.js";
import { HousingType } from "./housing-type.enum.js";
import { Amenity } from "./amenity.enum.js";
import { User } from "./user.type.js";
import { Coordinates } from "./coordinates.type.js";

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: CityName;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: HousingType;
  rooms: number;
  guests: number;
  price: number;
  amenities: Amenity[];
  author: User;
  commentCount: number;
  coordinates: Coordinates;
};
