import {
  Offer,
  isCityName,
  isHousingType,
  isAmenity,
  isUserType,
} from '../types/index.js';

export function createOffer(offerData: string): Offer {
  const [
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
    authorName,
    authorEmail,
    authorAvatarPath,
    authorPassword,
    authorType,
    commentCount,
    coordinates,
  ] = offerData.replace('\n', '').split('\t');

  const author = {
    name: authorName,
    email: authorEmail,
    avatarPath: authorAvatarPath,
    password: authorPassword,
    type: isUserType(authorType) ?? 'обычный',
  };

  return {
    title,
    description,
    postDate: new Date(createdDate),
    city: isCityName(city) ?? 'Paris',
    previewImage,
    images: images.split(';'),
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rating: parseFloat(rating),
    housingType: isHousingType(housingType) ?? 'apartment',
    rooms: parseInt(rooms, 10),
    guests: parseInt(guests, 10),
    price: parseInt(price, 10),
    amenities: amenities
      .split(';')
      .map((amenity) => isAmenity(amenity) ?? 'Breakfast'),
    author,
    commentCount: Number.parseInt(commentCount, 10),
    coordinates: {
      latitude: Number.parseFloat(coordinates.split(';')[0]),
      longitude: Number.parseFloat(coordinates.split(';')[1]),
    },
  };
}
