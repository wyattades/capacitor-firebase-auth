import firebase from 'firebase/app';
import 'firebase/auth';
import { SignInOptions, TwitterSignInResult } from '../definitions';
export declare const twitterSignInWeb: (options: {
    providerId: string;
    data?: SignInOptions;
}) => Promise<TwitterSignInResult>;
export declare const twitterLinkWeb: (options: {
    providerId: string;
    data?: SignInOptions;
}) => Promise<firebase.auth.UserCredential>;
