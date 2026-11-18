import { FavoriteService } from './favorite-service.interface.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';

@injectable()
export class DefaultFavoriteService implements FavoriteService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.FavoriteModel)
    private readonly favoriteModel: types.ModelType<FavoriteEntity>,
  ) {}

  public async create(
    userId: string,
    offerId: string,
  ): Promise<DocumentType<FavoriteEntity>> {
    const result = await this.favoriteModel.create({ userId, offerId });
    this.logger.info(
      `Добавлено в избранное: user=${userId}, offer=${offerId}.`,
    );

    return result.populate(['userId', 'offerId']);
  }

  public async delete(
    userId: string,
    offerId: string,
  ): Promise<DocumentType<FavoriteEntity> | null> {
    return this.favoriteModel
      .findOneAndDelete({ userId, offerId })
      .populate(['userId', 'offerId'])
      .exec();
  }

  public async findByUser(
    userId: string,
  ): Promise<DocumentType<FavoriteEntity>[]> {
    return this.favoriteModel.find({ userId }).populate('offerId').exec();
  }

  public async exists(userId: string, offerId: string): Promise<boolean> {
    return (
      (await this.favoriteModel.exists({
        userId: userId,
        offerId: offerId,
      })) !== null
    );
  }
}
