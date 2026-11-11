import { DocumentType } from '@typegoose/typegoose';
import { FavoriteDto } from './dto/favorite.dto.js';
import { FavoriteEntity } from './favorite.entity.js';

export interface FavoriteService {
  create(dto: FavoriteDto): Promise<DocumentType<FavoriteEntity>>;
  delete(dto: FavoriteDto): Promise<DocumentType<FavoriteEntity> | null>;
  findByUser(userId: string): Promise<DocumentType<FavoriteEntity>[]>;
  exists(dto: FavoriteDto): Promise<boolean>;
}
