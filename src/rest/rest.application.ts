import { Logger } from '../shared/libs/logger/index.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../shared/types/index.js';
import express, { Express } from 'express';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';
import { Controller, ExceptionFilter } from '../shared/libs/rest/index.js';

@injectable()
export class RestApplication {
  private server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient)
    private readonly databaseClient: DatabaseClient,
    @inject(Component.OfferController)
    private readonly offerController: Controller,
    @inject(Component.UserController)
    private readonly userController: Controller,
    @inject(Component.FavoriteController)
    private readonly favoriteController: Controller,
    @inject(Component.ExceptionFilter)
    private readonly appExceptionFilter: ExceptionFilter,
  ) {
    this.server = express();
  }

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  private async _initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async _initControllers() {
    this.server.use('/offers', this.offerController.router);
    this.server.use('/users', this.userController.router);
    this.server.use('/favorites', this.favoriteController.router);
  }

  private async _initMiddleware() {
    this.server.use(express.json());
  }

  private async _initExceptionFilters() {
    this.server.use(
      this.appExceptionFilter.catch.bind(this.appExceptionFilter),
    );
  }

  public async init() {
    this.logger.info('Инициализация приложения…');

    this.logger.info('Инициализация базы данных…');
    await this._initDb();
    this.logger.info('Инициализация базы данных завершена.');

    this.logger.info('Инициализация middleware…');
    await this._initMiddleware();
    this.logger.info('Инициализация middleware завершена.');

    this.logger.info('Инициализация контроллеров…');
    await this._initControllers();
    this.logger.info('Инициализация контроллеров завершена.');

    this.logger.info('Инициализация фильтров исключений…');
    await this._initExceptionFilters();
    this.logger.info('Инициализация фильтров исключений завершена.');

    this.logger.info('Инициализации сервера…');
    await this._initServer();
    this.logger.info(
      `Сервер запущен на http://localhost:${this.config.get('PORT')}.`,
    );
  }
}
