import { createContext, useContext, useEffect, useState } from 'react';
import { AuthStore } from './AuthStore';
import { LeaderBoardStore } from './LeaderBoardStore';
import { RoomStore } from './RoomStore';
import { SocialStore } from './SocialStore';

export enum EStoreKeys {
  AuthStoreKey = 'auth-store',
  RoomStoreKey = 'room-store',
  LeaderBoardKey = 'leaderboard-store',
  SocialStoreKey = 'social-store',
}

export interface IStoresProvider {
  [EStoreKeys.AuthStoreKey]?: AuthStore;
  [EStoreKeys.RoomStoreKey]?: RoomStore;
  [EStoreKeys.LeaderBoardKey]?: LeaderBoardStore;
  [EStoreKeys.SocialStoreKey]?: SocialStore;
}

export const StoresContext = createContext<IStoresProvider>({});

export const useResolveStore = <T>(key: EStoreKeys) => {
  const stores = useContext<IStoresProvider>(StoresContext);
  const [store, setStore] = useState<T>();

  useEffect(() => {
    if (!stores) {
      return;
    }
    if (!stores[key]) {
      throw new Error(`Store with ${key} has not been registered`);
    }
    setStore(stores[key] as T);
  }, [key, stores]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return store;
};

export const initializeStores = () => {
  const stores: IStoresProvider = {
    [EStoreKeys.AuthStoreKey]: new AuthStore(),
    [EStoreKeys.LeaderBoardKey]: new LeaderBoardStore(),
    [EStoreKeys.RoomStoreKey]: new RoomStore(),
    [EStoreKeys.SocialStoreKey]: new SocialStore(),
  };

  return stores;
};
