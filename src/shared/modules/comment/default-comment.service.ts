import { inject, injectable } from 'inversify';
import { CommentService } from './comment-service.interface.js';
import { Component } from '../../types/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { OfferService } from '../offer/index.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {}

  public async create(
    dto: CreateCommentDto,
  ): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);

    await this.offerService.recalculateRating(dto.offerId);
    await this.offerService.incCommentCount(dto.offerId);

    return comment.populate('userId');
  }

  public async findByOfferId(
    offerId: string,
  ): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.find({ offerId }).populate('userId');
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({ offerId }).exec();

    return result.deletedCount;
  }
}
