import firebase from 'firebase/app';
import 'firebase/auth';
import { AppleSignInResult, SignInOptions } from '../definitions';
export declare const appleSignInWeb: (options: {
    providerId: string;
    data?: SignInOptions;
}) => Promise<AppleSignInResult>;
export declare const appleLinkWeb: (options: {
    providerId: string;
    data?: SignInOptions;
}) => Promise<firebase.auth.UserCredential>;
