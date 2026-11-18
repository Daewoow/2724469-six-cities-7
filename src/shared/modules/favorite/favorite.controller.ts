import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  HttpError,
  HttpMethod,
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
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const favorites = await this.favoriteService.findByUser(
      '68ee44fb5eedf2ed1d053d3d',
    ); // ToDo: передавать реального пользователя
    const responseData = fillDTO(OfferShortRdo, favorites);
    this.ok(res, responseData);
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;

    const offerExists = await this.offerService.exists(offerId);
    if (!offerExists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Объявление с id «${offerId}» не найдено.`,
        'FavoriteController',
      );
    }

    const createData = {
      offerId,
      userId: '68ee4321dcd454f8dbf39c7e', // ToDo: передавать реального текущего пользователя
    };

    const exists = await this.favoriteService.exists(createData);
    if (exists) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Объявление с id «${offerId}» уже в избранном.`,
        'FavoriteController',
      );
    }

    await this.favoriteService.create(createData);
    this.ok(res, { message: 'Объявление добавлено в избранное.' });
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;

    const createData = {
      offerId,
      userId: '68ee4321dcd454f8dbf39c7e', // ToDo: передавать реального текущего пользователя
    };

    const exists = await this.favoriteService.exists(createData);
    if (!exists) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Объявление с id «${offerId}» не найдено.`,
        'FavoriteController',
      );
    }

    await this.favoriteService.delete(createData);
    this.ok(res, { message: 'Объявление удалено из избранного.' });
  }
}
