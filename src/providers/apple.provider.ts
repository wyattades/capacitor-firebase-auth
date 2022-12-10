import firebase from 'firebase/app';
import 'firebase/auth';

import { AppleSignInResult, SignInOptions } from '../definitions';

export const appleSignInWeb: (options: {
  providerId: string;
  data?: SignInOptions;
}) => Promise<AppleSignInResult> = async () => {
  const provider = new firebase.auth.OAuthProvider('apple.com');
  firebase.auth().useDeviceLanguage();
  const userCredential = await firebase.auth().signInWithPopup(provider);
  const credential =
    userCredential?.credential as firebase.auth.OAuthCredential;
  return new AppleSignInResult(
    credential.idToken as string,
    '',
    credential.accessToken as string,
    credential.secret ?? ''
  );
};

export const appleLinkWeb: (options: {
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
