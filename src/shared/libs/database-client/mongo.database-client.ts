import * as Mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { DatabaseClient } from './database-client.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../logger/index.js';
import { setTimeout } from 'node:timers/promises';
import { RETRY_COUNT, RETRY_TIMEOUT } from '../../constants/index.js';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose: typeof Mongoose;
  private isConnected: boolean;

  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.isConnected = false;
  }

  public isConnectedToDatabase() {
    return this.isConnected;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnectedToDatabase()) {
      throw new Error('MongoDB клиент уже подключен.');
    }

    this.logger.info('Попытка подключения к MongoDB…');

    let attempt = 0;
    while (attempt < RETRY_COUNT) {
      try {
        this.mongoose = await Mongoose.connect(uri);
        this.isConnected = true;
        this.logger.info('Подключение к базе данных установлено.');
        return;
      } catch (error) {
        attempt++;
        this.logger.error(
          `Не удалось подключиться к базе данных. Попытка ${attempt}.`,
          error as Error,
        );
        await setTimeout(RETRY_TIMEOUT);
      }
    }

    throw new Error(
      `Не удалось установить соединение с базой данных после ${RETRY_COUNT} попыток.`,
    );
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectedToDatabase()) {
      throw new Error('Нет подключения к базе данных.');
    }

    await this.mongoose.disconnect?.();
    this.isConnected = false;
    this.logger.info('Подключение к базе данных закрыто.');
  }
}
