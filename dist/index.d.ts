import firebase from 'firebase/app';
import { Observable, UnaryFunction } from 'rxjs';

interface SignInResult {
}
interface CapacitorFirebaseAuthPlugin {
    signIn<T extends SignInResult>(options: {
        providerId: string;
        data?: SignInOptions;
    }): Promise<T>;
    link<T extends SignInResult>(options: {
        providerId: string;
        data?: SignInOptions;
    }): Promise<T>;
    signOut(options: {}): Promise<void>;
}
declare class GoogleSignInResult implements SignInResult {
    idToken: string;
    providerId: string;
    constructor(idToken: string);
}
declare class TwitterSignInResult implements SignInResult {
    idToken: string;
    secret: string;
    providerId: string;
    constructor(idToken: string, secret: string);
}
declare class FacebookSignInResult implements SignInResult {
    idToken: string;
    providerId: string;
    constructor(idToken: string);
}
declare class AppleSignInResult implements SignInResult {
    idToken: string;
    rawNonce: string;
    accessToken: string;
    secret: string;
    providerId: string;
    constructor(idToken: string, rawNonce: string, accessToken: string, secret: string);
}
declare class PhoneSignInResult implements SignInResult {
    verificationId: string;
    verificationCode: string;
    providerId: string;
    constructor(verificationId: string, verificationCode: string);
}
interface PhoneSignInOptions {
    container?: HTMLElement;
    phone: string;
    verificationCode?: string;
}
declare type SignInOptions = PhoneSignInOptions;

declare const CapacitorFirebaseAuth: CapacitorFirebaseAuthPlugin;
declare const cfaLink: (providerId: string, data?: PhoneSignInOptions | undefined) => Observable<{
    userCredential: firebase.auth.UserCredential;
    result?: SignInResult;
}>;
declare const cfaLinkGoogle: () => Observable<{
    userCredential: firebase.auth.UserCredential;
    result?: GoogleSignInResult;
}>;
declare const cfaLinkTwitter: () => Observable<{
    userCredential: firebase.auth.UserCredential;
    result?: TwitterSignInResult;
}>;
declare const cfaLinkFacebook: () => Observable<{
    userCredential: firebase.auth.UserCredential;
    result?: FacebookSignInResult;
}>;
declare const cfaLinkApple: () => Observable<{
    userCredential: firebase.auth.UserCredential;
    result?: AppleSignInResult;
}>;
declare const cfaLinkPhone: (phone: string, verificationCode?: string | undefined) => Observable<{
    userCredential: firebase.auth.UserCredential;
    result?: PhoneSignInResult;
}>;
declare const cfaSignIn: (providerId: string, data?: PhoneSignInOptions | undefined) => Observable<{
    userCredential: firebase.auth.UserCredential;
    result: SignInResult;
}>;
declare const cfaSignInGoogle: () => Observable<{
    userCredential: firebase.auth.UserCredential;
    result: GoogleSignInResult;
}>;
declare const cfaSignInTwitter: () => Observable<{
    userCredential: firebase.auth.UserCredential;
    result: TwitterSignInResult;
}>;
declare const cfaSignInFacebook: () => Observable<{
    userCredential: firebase.auth.UserCredential;
    result: FacebookSignInResult;
}>;
declare const cfaSignInAppleProvider = "apple.com";
declare const cfaSignInApple: () => Observable<{
    userCredential: firebase.auth.UserCredential;
    result: AppleSignInResult;
}>;
declare const cfaSignInPhone: (phone: string, verificationCode?: string | undefined) => Observable<{
    userCredential: firebase.auth.UserCredential;
    result: PhoneSignInResult;
}>;
declare const cfaSignInPhoneOnCodeSent: () => Observable<string>;
declare const cfaSignInPhoneOnCodeReceived: () => Observable<{
    verificationId: string;
    verificationCode: string;
}>;
declare const cfaSignOut: () => Observable<void>;

declare const mapUserToUserInfo: () => UnaryFunction<Observable<firebase.User>, Observable<firebase.UserInfo>>;
declare const mapUserCredentialToUserInfo: () => UnaryFunction<Observable<{
    userCredential: firebase.auth.UserCredential;
}>, Observable<firebase.UserInfo | null>>;

export { AppleSignInResult, CapacitorFirebaseAuth, CapacitorFirebaseAuthPlugin, FacebookSignInResult, GoogleSignInResult, PhoneSignInOptions, PhoneSignInResult, SignInOptions, SignInResult, TwitterSignInResult, cfaLink, cfaLinkApple, cfaLinkFacebook, cfaLinkGoogle, cfaLinkPhone, cfaLinkTwitter, cfaSignIn, cfaSignInApple, cfaSignInAppleProvider, cfaSignInFacebook, cfaSignInGoogle, cfaSignInPhone, cfaSignInPhoneOnCodeReceived, cfaSignInPhoneOnCodeSent, cfaSignInTwitter, cfaSignOut, mapUserCredentialToUserInfo, mapUserToUserInfo };
