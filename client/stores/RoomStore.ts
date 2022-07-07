import { action, observable } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFindRoom, apiRoomLeave, apiRoomStatus } from '../api/RoomApi';
import { StoreState, TStoreState } from './StoreState';
import { GameTextDto } from '../api/dtos/GameTextDto';
import { RoomStatusDto } from '../api/dtos/RoomDto';
import { STORAGE_TOTAL_PLAYED_GAMES_KEY } from '../constants/common';

enum ECurrentRoomStateErrors {
  Unknown = 'unknown',
}

type TCurrentRoomState = TStoreState<GameTextDto, ECurrentRoomStateErrors>;

type TCurrentRoomStatusState = TStoreState<
  RoomStatusDto,
  ECurrentRoomStateErrors
>;

export class RoomStore {
  @observable public currentRoom: TCurrentRoomState = undefined;

  @observable public response: TCurrentRoomStatusState = undefined;

  @action public async findRoom(languageId: number) {
    const res = await apiFindRoom({ languageId });
    if (res.isLeft) {
      this.currentRoom = StoreState.error<ECurrentRoomStateErrors>(
        ECurrentRoomStateErrors.Unknown
      );
      return res;
    }
    this.currentRoom = StoreState.success<GameTextDto>(res.right);
    return res;
  }

  @action public async checkRoomStatus(position: number, accuracy: number) {
    const res = await apiRoomStatus({ position, accuracy });
    if (res.isLeft) {
      this.response = StoreState.error<ECurrentRoomStateErrors>(
        ECurrentRoomStateErrors.Unknown
      );
      return;
    }
    this.response = StoreState.success<RoomStatusDto>(res.right);
    StoreState.success<RoomStatusDto>(res.right);
  }

  @action public async roomLeave() {
    const res = await apiRoomLeave();
    if (res.isLeft) {
      this.response = StoreState.error<ECurrentRoomStateErrors>(
        ECurrentRoomStateErrors.Unknown
      );
      return;
    }
    StoreState.success<JSON>(res.right);
  }

  public static async getTotalPlayedGames() {
    const totalGames =
      (await AsyncStorage.getItem(STORAGE_TOTAL_PLAYED_GAMES_KEY)) ?? '0';
    return parseInt(totalGames, 10);
  }

  public static async setTotalPlayedGames(newValue: number) {
    return AsyncStorage.setItem(
      STORAGE_TOTAL_PLAYED_GAMES_KEY,
      String(newValue)
    );
  }
}
