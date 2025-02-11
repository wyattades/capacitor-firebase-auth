import { PluginListenerHandle } from '@capacitor/core';
import * as _firebase_auth from '@firebase/auth';
import { GoogleAuthProvider, AuthCredential, FacebookAuthProvider, TwitterAuthProvider, PhoneAuthProvider, OAuthProvider } from 'firebase/auth';

type EventMapping = {
    cfaSignInPhoneOnCodeSent: {
        verificationId: string;
    };
    cfaSignInPhoneOnCodeReceived: {
        verificationId: string;
        verificationCode: string;
    };
};
interface CapacitorFirebaseAuthPlugin {
    signIn<T>(options: {
        providerId: string;
        data?: SignInOptions;
    }): Promise<T>;
    link<T>(options: {
        providerId: string;
        data?: SignInOptions;
    }): Promise<T>;
    signOut(options: {}): Promise<void>;
    addListener(eventName: 'cfaSignInPhoneOnCodeSent', cb: (data: EventMapping['cfaSignInPhoneOnCodeSent']) => void): Promise<PluginListenerHandle> & PluginListenerHandle;
    addListener(eventName: 'cfaSignInPhoneOnCodeReceived', cb: (data: EventMapping['cfaSignInPhoneOnCodeReceived']) => void): Promise<PluginListenerHandle> & PluginListenerHandle;
    removeAllListeners(): Promise<void>;
}
type SignInResult = {
    providerId: string;
};
type GoogleSignInResult = SignInResult & {
    idToken: string;
};
type TwitterSignInResult = SignInResult & {
    idToken: string;
    secret: string;
};
type FacebookSignInResult = SignInResult & {
    idToken: string;
};
type AppleSignInResult = SignInResult & {
    idToken: string;
    rawNonce: string;
    accessToken: string;
    secret: string;
};
type PhoneSignInResult = SignInResult & {
    verificationId: string;
    verificationCode: string;
};
type PhoneSignInOptions = {
    container?: HTMLElement;
    phone: string;
    verificationCode?: string;
};
type SignInOptionsMap = {
    ['google.com']: never;
    ['apple.com']: never;
    ['facebook.com']: never;
    ['twitter.com']: never;
    phone: PhoneSignInOptions;
};
type SignInOptions = SignInOptionsMap[keyof SignInOptionsMap];

declare const CapacitorFirebaseAuth: CapacitorFirebaseAuthPlugin;
type MaybePromise<T> = T | Promise<T>;
declare class AppleAuthProvider extends OAuthProvider {
    static PROVIDER_ID: string;
    constructor();
}
declare const PROVIDER_MAP: {
    "google.com": {
        providerId: string;
        Provider: typeof GoogleAuthProvider;
        buildCredential: (signInResult: GoogleSignInResult, Provider: typeof GoogleAuthProvider) => MaybePromise<AuthCredential | null>;
    };
    "apple.com": {
        providerId: string;
        Provider: typeof AppleAuthProvider;
        buildCredential: (signInResult: AppleSignInResult, Provider: typeof AppleAuthProvider) => MaybePromise<AuthCredential | null>;
    };
    "facebook.com": {
        providerId: string;
        Provider: typeof FacebookAuthProvider;
        buildCredential: (signInResult: FacebookSignInResult, Provider: typeof FacebookAuthProvider) => MaybePromise<AuthCredential | null>;
    };
    "twitter.com": {
        providerId: string;
        Provider: typeof TwitterAuthProvider;
        buildCredential: (signInResult: TwitterSignInResult, Provider: typeof TwitterAuthProvider) => MaybePromise<AuthCredential | null>;
    };
    phone: {
        providerId: string;
        Provider: typeof PhoneAuthProvider;
        buildCredential: (signInResult: PhoneSignInResult, Provider: typeof PhoneAuthProvider) => MaybePromise<AuthCredential | null>;
    };
};
type SignInResultMap = {
    [K in keyof typeof PROVIDER_MAP]: Parameters<typeof PROVIDER_MAP[K]['buildCredential']>[0];
};
declare const signIn: <ProviderId extends "google.com" | "apple.com" | "facebook.com" | "twitter.com" | "phone">(providerId: ProviderId, ...[data]: SignInOptionsMap[ProviderId] extends never ? [] : [data: SignInOptionsMap[ProviderId]]) => Promise<{
    userCredential: _firebase_auth.UserCredential;
    result: SignInResultMap[ProviderId];
} | null>;
declare const link: <ProviderId extends "google.com" | "apple.com" | "facebook.com" | "twitter.com" | "phone">(providerId: ProviderId, ...[data]: SignInOptionsMap[ProviderId] extends never ? [] : [data: SignInOptionsMap[ProviderId]]) => Promise<{
    userCredential: _firebase_auth.UserCredential;
    result: SignInResultMap[ProviderId];
} | null>;
declare const signOut: () => Promise<void>;

export { AppleSignInResult, CapacitorFirebaseAuth, CapacitorFirebaseAuthPlugin, EventMapping, FacebookSignInResult, GoogleSignInResult, PhoneSignInOptions, PhoneSignInResult, SignInOptions, SignInOptionsMap, SignInResult, TwitterSignInResult, link, signIn, signOut };
