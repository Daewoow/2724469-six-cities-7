import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { CityName, Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import {
  DEFAULT_RETURN_OFFERS_COUNT,
  MAX_RETURN_OFFERS_LIMIT,
  DEFAULT_RETURN_PREMIUM_OFFERS_COUNT,
  MAX_RETURN_PREMIUM_OFFERS_LIMIT,
} from '../../constants/constants.js';
import { CommentEntity } from '../comment/index.js';
import { Types } from 'mongoose';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`Создано новое предложение: ${dto.title}.`);

    return result.populate('author');
  }

  public async findById(
    offerId: string,
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate('author').exec();
  }

  public async find(
    limit = DEFAULT_RETURN_OFFERS_COUNT,
  ): Promise<DocumentType<OfferEntity>[]> {
    limit = Math.min(limit, MAX_RETURN_OFFERS_LIMIT);
    return this.offerModel
      .find()
      .sort({ postDate: SortType.Down })
      .limit(limit)
      .populate('author')
      .exec();
  }

  public async deleteById(
    offerId: string,
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async updateById(
    offerId: string,
    dto: UpdateOfferDto,
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate('author')
      .exec();
  }

  public async incCommentCount(
    offerId: string,
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        $inc: {
          commentCount: 1,
        },
      })
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }

  public async recalculateRating(offerId: string): Promise<void> {
    const result = await this.commentModel
      .aggregate([
        {
          $match: { offerId: new Types.ObjectId(offerId) },
        },
        {
          $group: {
            _id: '$offer',
            averageRating: { $avg: '$rating' },
          },
        },
        {
          $project: {
            _id: 0,
            averageRating: { $round: ['$averageRating', 1] },
          },
        },
      ])
      .exec();

    const newRating = result.length > 0 ? result[0].averageRating : 0;

    await this.offerModel
      .updateOne({ _id: offerId }, { $set: { rating: newRating } })
      .exec();
  }

  public async findPremiumByCity(
    city: CityName,
    limit = DEFAULT_RETURN_PREMIUM_OFFERS_COUNT,
  ): Promise<DocumentType<OfferEntity>[]> {
    limit = Math.min(limit, MAX_RETURN_PREMIUM_OFFERS_LIMIT);
    return this.offerModel
      .find({ city, isPremium: true })
      .sort({ postDate: SortType.Down })
      .limit(limit)
      .populate('author')
      .exec();
  }
}
