import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  HttpError,
  HttpMethod,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component, isCityName } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { OfferShortRdo } from './rdo/offer-short.rdo.js';
import { StatusCodes } from 'http-status-codes';
import { CreateOfferRequest } from './create-offer-request.type.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Регистрация маршрутов для OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
    });
    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.getPremium,
    });
  }

  public async index(
    {
      query: { limit },
    }: Request<unknown, unknown, unknown, { limit?: number }>,
    res: Response,
  ): Promise<void> {
    const offers = await this.offerService.find(limit);

    // ToDo: сейчас в OfferShortRdo отсутствует поле isFavorite
    this.ok(res, fillDTO(OfferShortRdo, offers));
  }

  public async create(
    { body }: CreateOfferRequest,
    res: Response,
  ): Promise<void> {
    const createData = {
      ...body,
      rating: 0,
      postDate: new Date(),
      commentCount: 0,
      author: '68ee4321dcd454f8dbf39c7e', // ToDo: передавать реального автора
    };

    const result = await this.offerService.create(createData);
    this.created(res, fillDTO(OfferRdo, result));
  }

  public async show(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;

    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Объявление с id «${offerId}» не найдено.`,
        'OfferController',
      );
    }

    // ToDo: сейчас в OfferRdo отсутствует поле isFavorite
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;

    const existsOffer = await this.offerService.exists(offerId);
    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Объявление с id «${offerId}» не найдено.`,
        'OfferController',
      );
    }

    const offer = await this.offerService.updateById(offerId, req.body);

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;

    const existsOffer = await this.offerService.exists(offerId);
    if (!existsOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Объявление с id «${offerId}» не найдено.`,
        'OfferController',
      );
    }

    const offer = await this.offerService.deleteById(offerId);

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async getPremium(req: Request, res: Response): Promise<void> {
    const { city } = req.params;
    const validatedCity = isCityName(city);
    if (!validatedCity) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Город «${city}» не поддерживается. Доступные города: Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf.`,
        'OfferController',
      );
    }

    const { limit } = req.query;
    const limitNumber = limit ? +limit : undefined;

    const offer = await this.offerService.findPremiumByCity(
      validatedCity,
      limitNumber,
    );

    this.ok(res, fillDTO(OfferRdo, offer));
  }
}
