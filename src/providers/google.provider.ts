import firebase from 'firebase/app';
import 'firebase/auth';

import { GoogleSignInResult, SignInOptions } from '../definitions';

export const googleSignInWeb: (options: {
  providerId: string;
  data?: SignInOptions;
}) => Promise<GoogleSignInResult> = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().useDeviceLanguage();
  const userCredential = await firebase.auth().signInWithPopup(provider);
  const credential =
    userCredential?.credential as firebase.auth.OAuthCredential;
  return new GoogleSignInResult(credential.idToken as string);
};

export const googleLinkWeb: (options: {
  providerId: string;
  data?: SignInOptions;
}) => Promise<firebase.auth.UserCredential> = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().useDeviceLanguage();

  if (!firebase.auth().currentUser) {
    throw new Error('No user to link to');
  }
  return await firebase.auth().currentUser.linkWithPopup(provider);
};
