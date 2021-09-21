import "firebase/auth";

import firebase from "firebase/app";

import { WebPlugin } from "@capacitor/core";

import {
  CapacitorFirebaseAuthPlugin,
  SignInOptions,
  SignInResult,
} from "./definitions";
import { appleSignInWeb } from "./providers/apple.provider";
import {
  facebookSignInWeb,
  facebookLinkWeb,
} from "./providers/facebook.provider";
import { googleSignInWeb, googleLinkWeb } from "./providers/google.provider";
import { phoneSignInWeb, phoneLinkWeb } from "./providers/phone.provider";
import { twitterSignInWeb, twitterLinkWeb } from "./providers/twitter.provider";

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
    const appleProvider = "apple.com";
    const googleProvider = new firebase.auth.GoogleAuthProvider().providerId;
    const facebookProvider = new firebase.auth.FacebookAuthProvider()
      .providerId;
    const twitterProvider = new firebase.auth.TwitterAuthProvider().providerId;
    const phoneProvider = new firebase.auth.PhoneAuthProvider().providerId;

    switch (options.providerId) {
      case appleProvider:
        return appleSignInWeb(options) as any;
      case googleProvider:
        return googleSignInWeb(options) as any;
      case twitterProvider:
        return twitterSignInWeb(options) as any;
      case facebookProvider:
        return facebookSignInWeb(options) as any;
      case phoneProvider:
        return phoneSignInWeb(options) as any;
    }

    return Promise.reject(
      `The '${options.providerId}' provider was not supported`
    );
  }

  async link(options: {
    providerId: string;
  }): Promise<firebase.auth.UserCredential> {
    const googleProvider = firebase.auth.GoogleAuthProvider.PROVIDER_ID;
    const facebookProvider = firebase.auth.FacebookAuthProvider.PROVIDER_ID;
    const twitterProvider = firebase.auth.TwitterAuthProvider.PROVIDER_ID;
    const phoneProvider = firebase.auth.PhoneAuthProvider.PROVIDER_ID;
    switch (options.providerId) {
      case googleProvider:
        return googleLinkWeb();
      case twitterProvider:
        return twitterLinkWeb();
      case facebookProvider:
        return facebookLinkWeb();
      case phoneProvider:
        return phoneLinkWeb();
    }

    return Promise.reject(
      `The '${options.providerId}' provider was not supported`
    );
  }

  async signOut(options: {}): Promise<void> {
    console.log(options);
    return firebase.auth().signOut();
  }
}
