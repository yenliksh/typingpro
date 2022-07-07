import { action, observable } from 'mobx';
import { FriendsDto } from '../api/dtos/FriendsDto';
import { UserDto } from '../api/dtos/UserDto';
import {
  apiAcceptFriendRequest,
  apiAllFriends,
  apiDenyFriendRequest,
  apiFriendStatus,
  apiGetPersonalStatsById,
  apiIncomingRequests,
  apiRemoveFriendRequest,
  apiSendFriendRequest,
  apiUsersByNickname,
} from '../api/SocialApi';
import { StoreState, TStoreState } from './StoreState';

enum ESocialStoreErrors {
  Unknown = 'unknown',
}

type TCurrentFriendStatusState = TStoreState<FriendsDto, ESocialStoreErrors>;

type TCurrentAllFriendsState = TStoreState<UserDto[], ESocialStoreErrors>;

export class SocialStore {
  @observable public static currentFriendStatus: TCurrentFriendStatusState =
    undefined;

  @observable public static allFriends: TCurrentAllFriendsState = undefined;

  @action public static async getAllFriends() {
    const res = await apiAllFriends();
    if (res.isLeft) {
      this.allFriends = StoreState.error<ESocialStoreErrors>(
        ESocialStoreErrors.Unknown
      );
      return undefined;
    }
    this.allFriends = StoreState.success<UserDto[]>(res.right);
    return res.right;
  }

  @action public static async getIncomingRequests() {
    const res = await apiIncomingRequests();
    if (res.isLeft) {
      StoreState.error<ESocialStoreErrors>(ESocialStoreErrors.Unknown);
      return undefined;
    }
    return res.right;
  }

  @action public static async getUsersByNickname(
    nickname: string,
    id: number | undefined
  ) {
    const res = await apiUsersByNickname({ nickname, id });
    if (res.isLeft) {
      StoreState.error<ESocialStoreErrors>(ESocialStoreErrors.Unknown);
      return undefined;
    }
    return res.right;
  }

  @action public static async getPersonalStatsById(id: number) {
    const res = await apiGetPersonalStatsById({ id });
    if (res.isLeft) {
      StoreState.error<ESocialStoreErrors>(ESocialStoreErrors.Unknown);
      return undefined;
    }
    return res.right;
  }

  @action public static async sendFriendRequestToUser(id: number) {
    const res = await apiSendFriendRequest({ id });
    if (res.isLeft) {
      this.currentFriendStatus = StoreState.error<ESocialStoreErrors>(
        ESocialStoreErrors.Unknown
      );
      return undefined;
    }
    this.currentFriendStatus = StoreState.success<FriendsDto>(res.right);
    return res.right;
  }

  @action public static async removeFriendRequest(id: number) {
    const res = await apiRemoveFriendRequest({ id });
    if (res.isLeft) {
      return undefined;
    }
    StoreState.success<FriendsDto>(res.right);
    return res.right;
  }

  @action public static async denyFriendRequest(id: number) {
    const res = await apiDenyFriendRequest({ id });
    if (res.isLeft) {
      this.currentFriendStatus = StoreState.error<ESocialStoreErrors>(
        ESocialStoreErrors.Unknown
      );
      return undefined;
    }
    this.getAllFriends();
    this.currentFriendStatus = StoreState.success<FriendsDto>(res.right);
    return res.right;
  }

  @action public static async acceptFriendRequest(id: number) {
    const res = await apiAcceptFriendRequest({ id });
    if (res.isLeft) {
      this.currentFriendStatus = StoreState.error<ESocialStoreErrors>(
        ESocialStoreErrors.Unknown
      );
      return undefined;
    }
    this.getAllFriends();
    this.currentFriendStatus = StoreState.success<FriendsDto>(res.right);
    return res.right;
  }

  @action public static async getFriendStatus(id: number) {
    const res = await apiFriendStatus({ id });
    if (res.isLeft) {
      this.currentFriendStatus = StoreState.error<ESocialStoreErrors>(
        ESocialStoreErrors.Unknown
      );
      return undefined;
    }
    this.currentFriendStatus = StoreState.success<FriendsDto>(res.right);
    return res.right;
  }
}
