import {
  IsMongoId,
  IsString,
  Length,
  IsNumber,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { CreateCommentMessages } from './create-comment.messages.js';
import {
  MIN_COMMENT_TEXT_LENGTH,
  MAX_COMMENT_TEXT_LENGTH,
  MIN_RATING,
  MAX_RATING,
} from '../../../constants/constants.js';

export class CreateCommentDto {
  @IsString({ message: CreateCommentMessages.text.invalidFormat })
  @Length(MIN_COMMENT_TEXT_LENGTH, MAX_COMMENT_TEXT_LENGTH, {
    message: CreateCommentMessages.text.lengthField,
  })
  public text: string;

  @IsNumber({}, { message: CreateCommentMessages.rating.invalidFormat })
  @Min(MIN_RATING, { message: CreateCommentMessages.rating.minValue })
  @Max(MAX_RATING, { message: CreateCommentMessages.rating.maxValue })
  public rating: number;

  @IsMongoId({ message: CreateCommentMessages.userId.invalidFormat })
  public userId: string;

  @IsDateString({}, { message: CreateCommentMessages.postDate.invalidFormat })
  public postDate: Date;
}
