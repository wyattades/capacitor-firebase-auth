import firebase from 'firebase/app';
import 'firebase/auth';
import {PhoneSignInResult, SignInOptions} from '../definitions';

export const phoneSignInWeb: (options: {providerId: string, data?: SignInOptions}) => Promise<PhoneSignInResult>
    = async (options) => {

    // const provider = new firebase.auth.PhoneAuthProvider();
    return Promise.reject(`The '${options.providerId}' provider was not implemented for web yet`);
}

export const phoneLinkWeb: () => Promise<firebase.auth.UserCredential>
    = async () => {

    // const provider = new firebase.auth.PhoneAuthProvider();
    return Promise.reject(`The phone provider was not implemented for web yet`);
}
