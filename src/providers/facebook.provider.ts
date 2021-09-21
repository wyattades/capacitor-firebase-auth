import firebase from 'firebase/app';
import 'firebase/auth';

import { FacebookSignInResult, SignInOptions } from '../definitions';

export const facebookSignInWeb: (options: {
  providerId: string;
  data?: SignInOptions;
}) => Promise<FacebookSignInResult> = async () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().useDeviceLanguage();
  const userCredential = await firebase.auth().signInWithPopup(provider);
  const credential =
    userCredential?.credential as firebase.auth.OAuthCredential;
  return new FacebookSignInResult(credential?.accessToken as string);
};

export const facebookLinkWeb: (options: {
  providerId: string;
  data?: SignInOptions;
}) => Promise<firebase.auth.UserCredential> = async () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().useDeviceLanguage();

  if (!firebase.auth().currentUser) {
    throw new Error('No user to link to');
  }
  return await firebase.auth().currentUser.linkWithPopup(provider);
};
