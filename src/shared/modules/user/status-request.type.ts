import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export type StatusRequest = Request<
  ParamsDictionary,
  unknown,
  unknown,
  ParsedQs
>;
