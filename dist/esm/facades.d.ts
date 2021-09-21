import firebase from 'firebase/app';
import 'firebase/auth';
import { Observable } from 'rxjs';
import { AppleSignInResult, CapacitorFirebaseAuthPlugin, FacebookSignInResult, GoogleSignInResult, PhoneSignInResult, TwitterSignInResult, SignInResult, SignInOptions } from './definitions';
export declare const CapacitorFirebaseAuth: CapacitorFirebaseAuthPlugin;
export declare const cfaLink: (providerId: string, data?: SignInOptions) => Observable<{
    userCredential: firebase.auth.UserCredential;
    result?: SignInResult;
}>;
/**
 * Call the Google link method on native layer and links user on web layer with retrieved credentials.
 */
export declare const cfaLinkGoogle: () => Observable<{
    userCredential: firebase.auth.UserCredential;
    result?: GoogleSignInResult;
}>;
/**
 * Call the Twitter link method on native and link on web layer with retrieved credentials.
 */
export declare const cfaLinkTwitter: () => Observable<{
    userCredential: firebase.auth.UserCredential;
    result?: TwitterSignInResult;
}>;
/**
 * Call the Facebook link method on native and link on web layer with retrieved credentials.
 */
export declare const cfaLinkFacebook: () => Observable<{
    userCredential: firebase.auth.UserCredential;
    result?: FacebookSignInResult;
}>;
/**
 * Call the Apple link method on native and link on web layer with retrieved credentials.
 */
export declare const cfaLinkApple: () => Observable<{
    userCredential: firebase.auth.UserCredential;
    result?: AppleSignInResult;
}>;
/**
 * Call the Phone verification link, handling send and retrieve to code on native, but only link on web with retrieved credentials.
 * @param phone The user phone number.
 * @param verificationCode The verification code sent by SMS (optional).
 */
export declare const cfaLinkPhone: (phone: string, verificationCode?: string) => Observable<{
    userCredential: firebase.auth.UserCredential;
    result?: PhoneSignInResult;
}>;
/**
 * Call the sign in method on native layer and sign in on web layer with retrieved credentials.
 * @param providerId The provider identification.
 * @param data The provider additional information (optional).
 */
export declare const cfaSignIn: (providerId: string, data?: SignInOptions) => Observable<{
    userCredential: firebase.auth.UserCredential;
    result: SignInResult;
}>;
/**
 * Call the Google sign in method on native layer and sign in on web layer with retrieved credentials.
 */
export declare const cfaSignInGoogle: () => Observable<{
    userCredential: firebase.auth.UserCredential;
    result: GoogleSignInResult;
}>;
/**
 * Call the Twitter sign in method on native and sign in on web layer with retrieved credentials.
 */
export declare const cfaSignInTwitter: () => Observable<{
    userCredential: firebase.auth.UserCredential;
    result: TwitterSignInResult;
}>;
/**
 * Call the Facebook sign in method on native and sign in on web layer with retrieved credentials.
 */
export declare const cfaSignInFacebook: () => Observable<{
    userCredential: firebase.auth.UserCredential;
    result: FacebookSignInResult;
}>;
export declare const cfaSignInAppleProvider = "apple.com";
/**
 * Call the Apple sign in method on native and sign in on web layer with retrieved credentials.
 */
export declare const cfaSignInApple: () => Observable<{
    userCredential: firebase.auth.UserCredential;
    result: AppleSignInResult;
}>;
/**
 * Call the Phone verification sign in, handling send and retrieve to code on native, but only sign in on web with retrieved credentials.
 * @param phone The user phone number.
 * @param verificationCode The verification code sent by SMS (optional).
 */
export declare const cfaSignInPhone: (phone: string, verificationCode?: string) => Observable<{
    userCredential: firebase.auth.UserCredential;
    result: PhoneSignInResult;
}>;
/**
 * Observable of one notification of <code>On Code Sent</code>event from Phone Verification process.
 */
export declare const cfaSignInPhoneOnCodeSent: () => Observable<string>;
/**
 * Observable of one notification of <code>On Code Received</code> event from Phone Verification process.
 */
export declare const cfaSignInPhoneOnCodeReceived: () => Observable<{
    verificationId: string;
    verificationCode: string;
}>;
/**
 * Call Google sign out method on native and web layers.
 */
export declare const cfaSignOut: () => Observable<void>;
