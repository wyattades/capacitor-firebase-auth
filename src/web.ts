import {registerWebPlugin, WebPlugin} from '@capacitor/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import {CapacitorFirebaseAuthPlugin, SignInResult} from './definitions';
import {facebookSignInWeb, facebookLinkWeb} from './providers/facebook.provider';
import {googleSignInWeb, googleLinkWeb} from './providers/google.provider';
import {phoneSignInWeb, phoneLinkWeb} from './providers/phone.provider';
import {twitterSignInWeb, twitterLinkWeb} from './providers/twitter.provider';

export class CapacitorFirebaseAuthWeb extends WebPlugin implements CapacitorFirebaseAuthPlugin {
  constructor() {
    super({
      name: 'CapacitorFirebaseAuth',
      platforms: ['web']
    });
  }

  async signIn(options: {providerId: string;}): Promise<SignInResult> {
      const googleProvider = new firebase.auth.GoogleAuthProvider().providerId;
      const facebookProvider = new firebase.auth.FacebookAuthProvider().providerId;
      const twitterProvider = new firebase.auth.TwitterAuthProvider().providerId;
      const phoneProvider = new firebase.auth.PhoneAuthProvider().providerId;
      switch (options.providerId) {
          case googleProvider:
              return googleSignInWeb(options);
          case twitterProvider:
              return twitterSignInWeb(options);
          case facebookProvider:
              return facebookSignInWeb(options);
          case phoneProvider:
              return phoneSignInWeb(options);
      }

	  return Promise.reject(`The '${options.providerId}' provider was not supported`);
  }

  async link(options: {providerId: string;}): Promise<firebase.auth.UserCredential> {
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

    return Promise.reject(`The '${options.providerId}' provider was not supported`);
  }

  async signOut(options: {}): Promise<void> {
      console.log(options);
      return firebase.auth().signOut()
  }
}

const CapacitorFirebaseAuth = new CapacitorFirebaseAuthWeb();
export { CapacitorFirebaseAuth };

// Register as a web plugin
registerWebPlugin(CapacitorFirebaseAuth);
