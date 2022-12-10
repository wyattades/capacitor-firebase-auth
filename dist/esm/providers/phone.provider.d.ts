import firebase from 'firebase/app';
import 'firebase/auth';
import { PhoneSignInResult, SignInOptions } from '../definitions';
export declare const phoneSignInWeb: (options: {
    providerId: string;
    data?: SignInOptions;
}) => Promise<PhoneSignInResult>;
export declare const phoneLinkWeb: (options: {
    providerId: string;
    data?: SignInOptions;
}) => Promise<firebase.auth.UserCredential>;
