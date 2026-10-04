const amenities = [
  'Breakfast',
  'Air conditioning',
  'Laptop friendly workspace',
  'Baby seat',
  'Washer',
  'Towels',
  'Fridge',
];
export type Amenity = (typeof amenities)[number];

export function isAmenity(str: string): Amenity | undefined {
  const foundStr = amenities.find((val) => val === str);

  if (!foundStr) {
    return;
  }

  return foundStr;
}
