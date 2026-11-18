import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  HttpError,
  HttpMethod,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CommentService } from './comment-service.interface.js';
import { OfferService } from '../offer/index.js';
import { fillDTO } from '../../helpers/index.js';
import { CommentRdo } from './rdo/comment.rdo.js';

@injectable()
export default class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService)
    private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Регистрация маршрутов для CommentController…');
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;

    if (!(await this.offerService.exists(offerId))) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Объявление с id «${offerId}» не найдено.`,
        'CommentController',
      );
    }

    const comment = await this.commentService.create(offerId, req.body);
    await this.offerService.incCommentCount(offerId);
    await this.offerService.recalculateRating(offerId);
    this.created(res, fillDTO(CommentRdo, comment));
  }
}
