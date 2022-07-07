import Constants from 'expo-constants';
import { AuthStore } from '../stores/AuthStore';
import { Either } from './Either';
import { EitherType } from './EitherType';

export interface IApiError<T = unknown> {
  status: number;
  error: T;
}

export interface IRequestConfigs {
  withAuth?: boolean;
  isPatch?: boolean;
}

export class Fetcher {
  static async getJson<T, E = unknown>(args: {
    url: string;
    options?: RequestInit;
    configs?: IRequestConfigs;
  }): Promise<EitherType<IApiError<E>, T>> {
    const { url, options, configs = {} } = args;
    let optionsModified = options;
    if (configs?.withAuth) {
      const token = await AuthStore.getAuthorizationToken();
      optionsModified = {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: token,
          'Content-Type': 'application/json',
        },
      };
    }
    const res = await fetch((Constants.manifest?.extra?.apiUrl ?? '') + url, {
      method: 'GET',
      ...optionsModified,
    });
    if (res.status < 300) {
      return Either.right((await res.json()) as T);
    }
    const error = await res.json();
    return Either.left({
      status: res.status,
      error: error as E,
    });
  }

  static async postJson<T, E = unknown>(args: {
    url: string;
    data: Record<string, unknown>;
    options?: RequestInit;
    configs?: IRequestConfigs;
  }): Promise<EitherType<IApiError<E>, T>> {
    const { url, data = {}, options = {}, configs = {} } = args;
    const optionsModified: RequestInit = {
      ...options,
      headers: {
        ...options?.headers,
        'Content-Type': 'application/json',
      },
    };
    if (configs?.withAuth) {
      const token = await AuthStore.getAuthorizationToken();
      (optionsModified.headers as any).Authorization = token;
    }
    const res = await fetch((Constants.manifest?.extra?.apiUrl ?? '') + url, {
      method: configs.isPatch ? 'PATCH' : 'POST',
      ...optionsModified,
      body: JSON.stringify({ ...data }),
    });
    if (res.status < 300) {
      return Either.right((await res.json()) as T);
    }
    const error = await res.json();
    return Either.left({
      status: res.status,
      error: error as E,
    });
  }
}
