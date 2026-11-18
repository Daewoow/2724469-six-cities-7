import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component, isCityName } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { OfferShortRdo } from './rdo/offer-short.rdo.js';
import { CreateOfferRequest } from './create-offer-request.type.js';
import { ParamOfferId } from './type/param-offerid.type.js';
import { CommentRdo, CommentService } from '../comment/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService)
    private readonly commentService: CommentService,
  ) {
    super(logger);

    this.logger.info('Регистрация маршрутов для OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.getPremium,
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
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
    const result = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, result));
  }

  public async show(
    { params }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);

    // ToDo: сейчас в OfferRdo отсутствует поле isFavorite
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;

    const offer = await this.offerService.updateById(offerId, req.body);

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async delete(
    { params }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;

    const offer = await this.offerService.deleteById(offerId);

    await this.commentService.deleteByOfferId(offerId);

    this.noContent(res, offer);
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

  public async getComments(
    { params }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
