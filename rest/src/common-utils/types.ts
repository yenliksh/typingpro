import express from 'express';
import { ValidationError } from 'express-validator';

// eslint-disable-next-line no-shadow
export enum EErrorResponseType {
  Validation = 'validation',
  Custom = 'custom',
}

export type TErrorResponse =
  | {
      type: EErrorResponseType.Validation;
      errors: ValidationError[];
    }
  | {
      type: EErrorResponseType.Custom;
      error: string;
    };

export interface TypedRequestBody<T> extends express.Request {
  body: T;
}

export type TypedResponseBody<T> = express.Response<T>;
