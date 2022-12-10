import firebase from 'firebase/app';
import 'firebase/auth';
import { FacebookSignInResult, SignInOptions } from '../definitions';
export declare const facebookSignInWeb: (options: {
    providerId: string;
    data?: SignInOptions;
}) => Promise<FacebookSignInResult>;
export declare const facebookLinkWeb: (options: {
    providerId: string;
    data?: SignInOptions;
}) => Promise<firebase.auth.UserCredential>;
