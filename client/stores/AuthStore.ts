import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  getAuth,
  signInAnonymously,
  EmailAuthProvider,
  linkWithCredential,
} from 'firebase/auth';
import { action, observable, runInAction } from 'mobx';
import * as Sentry from 'sentry-expo';
// import * as Analytics from 'expo-firebase-analytics';
import {
  apiAllLanguages,
  apiCPMdata,
  apiSetImage,
  apiPersonalStats,
  apiSetUserChanges,
  apiUserGet,
  apiContributionData,
} from '../api/UserApi';
import { Either } from '../common-utils/Either';
import { UserDto } from '../api/dtos/UserDto';
import { StoreState, TStoreState } from './StoreState';

enum EAuthStoreErrors {
  SignInError = 'sign-in-error',
  SignUpError = 'sign-up-error',
  ResetPasswordError = 'reset-passsword-error',
  Unknown = 'unknown',
}

enum ECurrentUserStateErrors {
  Unknown = 'unknown',
}

enum ELanguageStateErrors {
  Unknown = 'unknown',
}

type TCurrentUserState = TStoreState<UserDto, ECurrentUserStateErrors>;

export class AuthStore {
  @observable public currentUser: TCurrentUserState = undefined;

  constructor() {
    const auth = getAuth();
    runInAction(() => {
      this.currentUser = StoreState.loading();
    });
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Analytics.setUserId(user.uid);
        this.getCurrentUser();
      } else {
        // Analytics.setUserId(null);
        runInAction(() => {
          this.currentUser = undefined;
        });
      }
    });
  }

  @action public static async signIn(email: string, password: string) {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      return Either.right(undefined);
    } catch (e) {
      Sentry.Browser.captureException(e);
      return Either.left(EAuthStoreErrors.SignInError);
    }
  }

  @action public static async signInAnonymously() {
    try {
      const auth = getAuth();
      const user = await signInAnonymously(auth);
      return Either.right(user);
    } catch (e) {
      Sentry.Browser.captureException(e);
      return Either.left(EAuthStoreErrors.SignInError);
    }
  }

  @action public static async resetPassword(email: string) {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      return Either.right(undefined);
    } catch (e) {
      Sentry.Browser.captureException(e);
      return Either.left(EAuthStoreErrors.ResetPasswordError);
    }
  }

  @action public async signUp(email: string, password: string) {
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        if (!this.currentUser?.value.email) {
          const credential = EmailAuthProvider.credential(email, password);
          const { currentUser } = auth;
          if (currentUser) {
            const userCredentials = await linkWithCredential(
              currentUser,
              credential
            );
            const { user } = userCredentials;
            if (user) {
              await this.getCurrentUser();
              return Either.right(undefined);
            }
            throw new Error('Firebase user field is not present');
          }
        }
      }
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user.user) {
        await this.getCurrentUser();
        return Either.right(undefined);
      }
      throw new Error('Firebase user field is not present');
    } catch (e) {
      const currentFirebaseUser = getAuth().currentUser;
      if (currentFirebaseUser) {
        await deleteUser(currentFirebaseUser);
      }
      Sentry.Browser.captureException(e);
      return Either.left(EAuthStoreErrors.SignUpError);
    }
  }

  @action public async getCurrentUser() {
    this.currentUser = StoreState.loading();
    const uid = getAuth().currentUser?.uid;
    if (!uid) {
      this.currentUser = undefined;
      return;
    }
    const res = await apiUserGet({ uid });
    if (res.isLeft) {
      this.currentUser = StoreState.error<ECurrentUserStateErrors>(
        ECurrentUserStateErrors.Unknown
      );
      return;
    }
    this.currentUser = StoreState.success<UserDto>(res.right);
  }

  @action public static async getAllTextLanguages() {
    const res = await apiAllLanguages();
    if (res.isLeft) {
      StoreState.error<ELanguageStateErrors>(ELanguageStateErrors.Unknown);
      return undefined;
    }
    return res.right;
  }

  @action public async saveChanges(nickname: string, country: string) {
    const uid = getAuth().currentUser?.uid;
    if (!uid) {
      this.currentUser = undefined;
      return;
    }
    const res = await apiSetUserChanges({ uid, nickname, country });
    if (res.isLeft) {
      this.currentUser = StoreState.error<ECurrentUserStateErrors>(
        ECurrentUserStateErrors.Unknown
      );
      return;
    }
    this.currentUser = StoreState.success<UserDto>(res.right);
  }

  @action public async saveAvatar(image: string) {
    const res = await apiSetImage({ image });
    if (res.isLeft) {
      this.currentUser = StoreState.error<ECurrentUserStateErrors>(
        ECurrentUserStateErrors.Unknown
      );
      return;
    }
    this.currentUser = StoreState.success<UserDto>(res.right);
  }

  @action public static async getCPMData() {
    const res = await apiCPMdata();
    if (res.isLeft) {
      StoreState.error<ECurrentUserStateErrors>(
        ECurrentUserStateErrors.Unknown
      );
      return undefined;
    }
    return res.right;
  }

  @action public static async getContributionData() {
    const res = await apiContributionData();
    if (res.isLeft) {
      StoreState.error<ECurrentUserStateErrors>(
        ECurrentUserStateErrors.Unknown
      );
      return undefined;
    }
    return res.right;
  }

  @action public static async getPersonalStats() {
    const res = await apiPersonalStats();
    if (res.isLeft) {
      StoreState.error<ECurrentUserStateErrors>(
        ECurrentUserStateErrors.Unknown
      );
      return undefined;
    }
    return res.right;
  }

  public static async signOut() {
    const auth = getAuth();
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      Sentry.Browser.captureException(e);
    }
  }

  public static async getAuthorizationToken() {
    try {
      const token = await getAuth().currentUser?.getIdToken();
      if (!token) {
        throw new Error('Empty Firebase token');
      }
      return token;
    } catch (e) {
      Sentry.Browser.captureException(e);
      return '';
    }
  }
}
