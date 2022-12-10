import firebase from 'firebase/app';
import 'firebase/auth';

import { SignInOptions, TwitterSignInResult } from '../definitions';

import OAuthCredential = firebase.auth.OAuthCredential;

export const twitterSignInWeb: (options: {
  providerId: string;
  data?: SignInOptions;
}) => Promise<TwitterSignInResult> = async () => {
  const provider = new firebase.auth.TwitterAuthProvider();
  firebase.auth().useDeviceLanguage();
  const userCredential = await firebase.auth().signInWithPopup(provider);
  const credential = userCredential?.credential as OAuthCredential;
  return new TwitterSignInResult(
    credential.accessToken as string,
    credential.secret as string
  );
};

export const twitterLinkWeb: (options: {
  providerId: string;
  data?: SignInOptions;
}) => Promise<firebase.auth.UserCredential> = async () => {
  const provider = new firebase.auth.TwitterAuthProvider();
  firebase.auth().useDeviceLanguage();

  if (!firebase.auth().currentUser) {
    throw new Error('No user to link to');
  }
  return await firebase.auth().currentUser.linkWithPopup(provider);
};
