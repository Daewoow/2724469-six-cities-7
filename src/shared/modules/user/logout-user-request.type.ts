import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export type LogoutRequest = Request<
  ParamsDictionary,
  unknown,
  unknown,
  ParsedQs
>;
