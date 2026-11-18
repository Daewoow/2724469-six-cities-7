import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  HttpError,
  HttpMethod,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { FavoriteService } from './favorite-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferShortRdo } from '../offer/rdo/offer-short.rdo.js';
import { StatusCodes } from 'http-status-codes';
import { OfferService } from '../offer/offer-service.interface.js';

@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.FavoriteService)
    private readonly favoriteService: FavoriteService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);
    this.logger.info('Регистрация маршрутов для FavoriteController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
  }

  public async index({ body }: Request, res: Response): Promise<void> {
    const { userId } = body;
    const favorites = await this.favoriteService.findByUser(userId);
    const responseData = fillDTO(OfferShortRdo, favorites);
    this.ok(res, responseData);
  }

  public async create({ body, params }: Request, res: Response): Promise<void> {
    const { userId } = body;
    const { offerId } = params;

    const offerExists = await this.offerService.exists(offerId);
    if (!offerExists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Объявление с id «${offerId}» не найдено.`,
        'FavoriteController',
      );
    }

    const exists = await this.favoriteService.exists(userId, offerId);
    if (exists) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Объявление с id «${offerId}» уже в избранном.`,
        'FavoriteController',
      );
    }

    await this.favoriteService.create(userId, offerId);
    this.ok(res, { message: 'Объявление добавлено в избранное.' });
  }

  public async delete({ body, params }: Request, res: Response): Promise<void> {
    const { userId } = body;
    const { offerId } = params;

    const exists = await this.favoriteService.exists(userId, offerId);
    if (!exists) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Объявление с id «${offerId}» не найдено.`,
        'FavoriteController',
      );
    }

    await this.favoriteService.delete(userId, offerId);
    this.ok(res, { message: 'Объявление удалено из избранного.' });
  }
}
