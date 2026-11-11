import { OfferEntity } from '../offer/index.js';
import { UserEntity } from '../user/index.js';
import {
  defaultClasses,
  modelOptions,
  getModelForClass,
  prop,
  Ref,
} from '@typegoose/typegoose';

export interface FavoriteEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'favorites',
  },
})
export class FavoriteEntity extends defaultClasses.TimeStamps {
  @prop({
    ref: 'UserEntity',
    required: true,
  })
  public userId: Ref<UserEntity>;

  @prop({
    ref: 'OfferEntity',
    required: true,
  })
  public offerId: Ref<OfferEntity>;
}

export const FavoriteModel = getModelForClass(FavoriteEntity);
