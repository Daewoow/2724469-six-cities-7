import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { Component } from '../../types/index.js';
import { FavoriteService } from './favorite-service.interface.js';
import { DefaultFavoriteService } from './default-favorite.service.js';
import { FavoriteEntity, FavoriteModel } from './favorite.entity.js';
import { FavoriteController } from './favorite.controller.js';
import { Controller } from '../../libs/rest/index.js';

export function createFavoriteContainer() {
  const favoriteContainer = new Container();

  favoriteContainer
    .bind<FavoriteService>(Component.FavoriteService)
    .to(DefaultFavoriteService);
  favoriteContainer
    .bind<types.ModelType<FavoriteEntity>>(Component.FavoriteModel)
    .toConstantValue(FavoriteModel);
  favoriteContainer
    .bind<Controller>(Component.FavoriteController)
    .to(FavoriteController)
    .inSingletonScope();

  return favoriteContainer;
}
