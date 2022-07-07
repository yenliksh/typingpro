export type EitherType<L, R> =
  | {
      type: 'left';
      isLeft: true;
      isRight: false;
      right: undefined;
      left: L;
    }
  | {
      type: 'right';
      isLeft: false;
      isRight: true;
      right: R;
      left: undefined;
    };
