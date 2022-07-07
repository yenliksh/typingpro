import { action } from 'mobx';
import { StoreState } from './StoreState';
import {
  apiFriends,
  apiLeaderBoard,
  apiLeaderBoardAllTheTime,
} from '../api/LeaderBoardApi';

enum ECurrentLeaderBoardStateErrors {
  Unknown = 'unknown',
}

export class LeaderBoardStore {
  @action public static async leaderBoard() {
    const res = await apiLeaderBoard();
    if (res.isLeft) {
      StoreState.error<ECurrentLeaderBoardStateErrors>(
        ECurrentLeaderBoardStateErrors.Unknown
      );
      return undefined;
    }
    return res.right;
  }

  @action public static async leaderBoardAllTheTime() {
    const res = await apiLeaderBoardAllTheTime();
    if (res.isLeft) {
      StoreState.error<ECurrentLeaderBoardStateErrors>(
        ECurrentLeaderBoardStateErrors.Unknown
      );
      return undefined;
    }
    return res.right;
  }

  @action public static async friends() {
    const res = await apiFriends();
    if (res.isLeft) {
      StoreState.error<ECurrentLeaderBoardStateErrors>(
        ECurrentLeaderBoardStateErrors.Unknown
      );
      return undefined;
    }
    return res.right;
  }
}
