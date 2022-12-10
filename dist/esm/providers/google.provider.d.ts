import firebase from 'firebase/app';
import 'firebase/auth';
import { GoogleSignInResult, SignInOptions } from '../definitions';
export declare const googleSignInWeb: (options: {
    providerId: string;
    data?: SignInOptions;
}) => Promise<GoogleSignInResult>;
export declare const googleLinkWeb: (options: {
    providerId: string;
    data?: SignInOptions;
}) => Promise<firebase.auth.UserCredential>;
