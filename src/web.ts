import firebase from 'firebase/app';
import 'firebase/auth';
import { WebPlugin } from '@capacitor/core';

import {
  CapacitorFirebaseAuthPlugin,
  SignInOptions,
  SignInResult,
} from './definitions';
import { appleSignInWeb, appleLinkWeb } from './providers/apple.provider';
import {
  facebookSignInWeb,
  facebookLinkWeb,
} from './providers/facebook.provider';
import { googleSignInWeb, googleLinkWeb } from './providers/google.provider';
import { phoneSignInWeb, phoneLinkWeb } from './providers/phone.provider';
import { twitterSignInWeb, twitterLinkWeb } from './providers/twitter.provider';

const appleProviderId = 'apple.com';

export class CapacitorFirebaseAuthWeb
  extends WebPlugin
  implements CapacitorFirebaseAuthPlugin
{
  constructor() {
    super();
  }

  async signIn<T extends SignInResult>(options: {
    providerId: string;
    data?: SignInOptions;
  }): Promise<T> {
    switch (options.providerId) {
      case appleProviderId:
        return appleSignInWeb(options) as any;
      case firebase.auth.GoogleAuthProvider.PROVIDER_ID:
        return googleSignInWeb(options) as any;
      case firebase.auth.TwitterAuthProvider.PROVIDER_ID:
        return twitterSignInWeb(options) as any;
      case firebase.auth.FacebookAuthProvider.PROVIDER_ID:
        return facebookSignInWeb(options) as any;
      case firebase.auth.PhoneAuthProvider.PROVIDER_ID:
        return phoneSignInWeb(options) as any;
    }

    return Promise.reject(
      `The '${options.providerId}' provider was not supported`
    );
  }

  async link<T extends SignInResult>(options: {
    providerId: string;
    data?: SignInOptions;
  }): Promise<T> {
    switch (options.providerId) {
      case appleProviderId:
        return appleLinkWeb(options) as any;
      case firebase.auth.GoogleAuthProvider.PROVIDER_ID:
        return googleLinkWeb(options) as any;
      case firebase.auth.TwitterAuthProvider.PROVIDER_ID:
        return twitterLinkWeb(options) as any;
      case firebase.auth.FacebookAuthProvider.PROVIDER_ID:
        return facebookLinkWeb(options) as any;
      case firebase.auth.PhoneAuthProvider.PROVIDER_ID:
        return phoneLinkWeb(options) as any;
    }

    return Promise.reject(
      `The '${options.providerId}' provider was not supported`
    );
  }

  async signOut(_options: {}): Promise<void> {
    return firebase.auth().signOut();
  }
}
