import firebase from 'firebase/app';
import 'firebase/auth';
import { WebPlugin } from '@capacitor/core';
import { appleSignInWeb, appleLinkWeb } from './providers/apple.provider';
import { facebookSignInWeb, facebookLinkWeb, } from './providers/facebook.provider';
import { googleSignInWeb, googleLinkWeb } from './providers/google.provider';
import { phoneSignInWeb, phoneLinkWeb } from './providers/phone.provider';
import { twitterSignInWeb, twitterLinkWeb } from './providers/twitter.provider';
const appleProviderId = 'apple.com';
export class CapacitorFirebaseAuthWeb extends WebPlugin {
    constructor() {
        super();
    }
    async signIn(options) {
        switch (options.providerId) {
            case appleProviderId:
                return appleSignInWeb(options);
            case firebase.auth.GoogleAuthProvider.PROVIDER_ID:
                return googleSignInWeb(options);
            case firebase.auth.TwitterAuthProvider.PROVIDER_ID:
                return twitterSignInWeb(options);
            case firebase.auth.FacebookAuthProvider.PROVIDER_ID:
                return facebookSignInWeb(options);
            case firebase.auth.PhoneAuthProvider.PROVIDER_ID:
                return phoneSignInWeb(options);
        }
        return Promise.reject(`The '${options.providerId}' provider was not supported`);
    }
    async link(options) {
        switch (options.providerId) {
            case appleProviderId:
                return appleLinkWeb(options);
            case firebase.auth.GoogleAuthProvider.PROVIDER_ID:
                return googleLinkWeb(options);
            case firebase.auth.TwitterAuthProvider.PROVIDER_ID:
                return twitterLinkWeb(options);
            case firebase.auth.FacebookAuthProvider.PROVIDER_ID:
                return facebookLinkWeb(options);
            case firebase.auth.PhoneAuthProvider.PROVIDER_ID:
                return phoneLinkWeb(options);
        }
        return Promise.reject(`The '${options.providerId}' provider was not supported`);
    }
    async signOut(_options) {
        return firebase.auth().signOut();
    }
}
//# sourceMappingURL=web.js.map