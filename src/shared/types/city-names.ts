const cityNames = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
] as const;
export type CityName = (typeof cityNames)[number];

export function getAllCityNames(): CityName[] {
  return [...cityNames];
}

export function isCityName(str: string): CityName | undefined {
  const foundStr = cityNames.find((val) => val === str);

  if (!foundStr) {
    return;
  }

  return foundStr;
}
