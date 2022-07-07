import { EitherType } from './EitherType';

export class Either {
  static left<T>(value: T) {
    return {
      type: 'left',
      isLeft: true,
      isRight: false,
      right: undefined,
      left: value,
    } as EitherType<T, never>;
  }

  static right<T>(value: T) {
    return {
      type: 'right',
      isLeft: false,
      isRight: true,
      right: value,
      left: undefined,
    } as EitherType<never, T>;
  }
}
