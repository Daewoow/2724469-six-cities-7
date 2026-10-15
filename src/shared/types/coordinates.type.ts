import {
  PARIS_LAT,
  PARIS_LON,
  COLOGNE_LAT,
  COLOGNE_LON,
  BRUSSELS_LAT,
  BRUSSELS_LON,
  AMSTERDAM_LAT,
  AMSTERDAM_LON,
  HAMBURG_LAT,
  HAMBURG_LON,
  DUSSELDORF_LAT,
  DUSSELDORF_LON,
} from '../constants/index.js';
import { CityName, isCityName } from './city-names.js';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

const DEFAULT_CITY_COORDINATES: Record<CityName, Coordinates> = {
  Paris: { latitude: PARIS_LAT, longitude: PARIS_LON },
  Cologne: { latitude: COLOGNE_LAT, longitude: COLOGNE_LON },
  Brussels: { latitude: BRUSSELS_LAT, longitude: BRUSSELS_LON },
  Amsterdam: { latitude: AMSTERDAM_LAT, longitude: AMSTERDAM_LON },
  Hamburg: { latitude: HAMBURG_LAT, longitude: HAMBURG_LON },
  Dusseldorf: { latitude: DUSSELDORF_LAT, longitude: DUSSELDORF_LON },
};

export function getDefaultCityCoordinates(city?: string): Coordinates {
  const validCity = city ? isCityName(city) : undefined;

  if (validCity) {
    return DEFAULT_CITY_COORDINATES[validCity];
  }

  return { latitude: 48.85661, longitude: 2.351499 };
}
