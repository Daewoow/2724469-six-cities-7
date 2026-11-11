import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CityName } from '../../types/city-names.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(limit?: number): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(
    offerId: string,
    dto: UpdateOfferDto,
  ): Promise<DocumentType<OfferEntity> | null>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  exists(documentId: string): Promise<boolean>;
  recalculateRating(offerId: string): Promise<void>;
  findPremiumByCity(
    city: CityName,
    limit?: number,
  ): Promise<DocumentType<OfferEntity>[]>;
}
