import firebase from 'firebase/app';
import 'firebase/auth';

import { PhoneSignInResult, SignInOptions } from '../definitions';

export const phoneSignInWeb: (options: {
  providerId: string;
  data?: SignInOptions;
}) => Promise<PhoneSignInResult> = async (options) => {
  firebase.auth().useDeviceLanguage();
  const code = options.data?.verificationCode as string;
  const verifier = new firebase.auth.RecaptchaVerifier(options.data?.container);
  const userCredential = await firebase
    .auth()
    .signInWithPhoneNumber(options.data?.phone as string, verifier);
  const confirmation = await userCredential.confirm(code);
  const idToken = await confirmation.user?.getIdToken();
  return new PhoneSignInResult(idToken as string, code);
};

export const phoneLinkWeb: (options: {
  providerId: string;
  data?: SignInOptions;
}) => Promise<firebase.auth.UserCredential> = async () => {
  // const provider = new firebase.auth.PhoneAuthProvider();
  return Promise.reject(`The phone provider was not implemented for web yet`);
};
