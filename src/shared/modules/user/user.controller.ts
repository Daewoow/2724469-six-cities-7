import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  HttpError,
  HttpMethod,
} from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CreateUserRequest } from './create-user-request.type.js';
import { LoginUserRequest } from './login-user-request.type.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { UserService } from './user-service.interface.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config)
    private readonly configService: Config<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Регистрация маршрутов для UserController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Post,
      handler: this.logout,
    });
    this.addRoute({
      path: '/status',
      method: HttpMethod.Get,
      handler: this.status,
    });
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);
    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Пользователь с email «${body.email}» уже существует.`,
        'UserController',
      );
    }
    const result = await this.userService.create(
      body,
      this.configService.get('SALT'),
    );
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    { body }: LoginUserRequest,
    _res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `Пользователь с email «${body.email}» не найден.`,
        'UserController',
      );
    }

    // TODO: Реализовать вход в систему
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Аутентификация пока не реализована.',
      'UserController',
    );
  }

  public async logout(_req: Request, _res: Response): Promise<void> {
    // TODO: Реализовать выход из системы
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Выход пока не реализован.',
      'UserController',
    );
  }

  public async status(_req: Request, _res: Response): Promise<void> {
    // TODO: Реализовать проверку авторизации
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Проверка статуса пока не реализована.',
      'UserController',
    );
  }
}
