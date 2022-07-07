export type TStoreState<T = unknown, E = unknown> =
  | {
      type: 'loading';
      error: never;
      value: never;
      loading: true;
    }
  | {
      type: 'success';
      error: never;
      value: T;
      loading: false;
    }
  | {
      type: 'error';
      error: E;
      value: never;
      loading: false;
    }
  | undefined;

export class StoreState {
  public static loading() {
    return {
      type: 'loading',
      error: undefined,
      value: undefined,
      loading: true,
    } as TStoreState<never, never>;
  }

  public static success<T>(value: T) {
    return {
      type: 'success',
      error: undefined,
      value,
      loading: false,
    } as TStoreState<T, never>;
  }

  public static error<E>(error: E) {
    return {
      type: 'error',
      error,
      value: undefined,
      loading: false,
    } as TStoreState<never, E>;
  }
}
