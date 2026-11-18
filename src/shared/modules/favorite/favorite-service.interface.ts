import { DocumentType } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';

export interface FavoriteService {
  create(
    userId: string,
    offerId: string,
  ): Promise<DocumentType<FavoriteEntity>>;
  delete(
    userId: string,
    offerId: string,
  ): Promise<DocumentType<FavoriteEntity> | null>;
  findByUser(userId: string): Promise<DocumentType<FavoriteEntity>[]>;
  exists(userId: string, offerId: string): Promise<boolean>;
}
