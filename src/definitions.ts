import type { PluginListenerHandle } from '@capacitor/core';

export type EventMapping = {
  cfaSignInPhoneOnCodeSent: {
    verificationId: string;
  };
  cfaSignInPhoneOnCodeReceived: {
    verificationId: string;
    verificationCode: string;
  };
};

export interface CapacitorFirebaseAuthPlugin {
  signIn<T>(options: { providerId: string; data?: SignInOptions }): Promise<T>;
  link<T>(options: { providerId: string; data?: SignInOptions }): Promise<T>;
  signOut(options: {}): Promise<void>;

  /**
   * Add listener for <code>On Code Sent</code> event from Phone Verification process.
   */
  addListener(
    eventName: 'cfaSignInPhoneOnCodeSent',
    cb: (data: EventMapping['cfaSignInPhoneOnCodeSent']) => void
  ): Promise<PluginListenerHandle> & PluginListenerHandle;

  /**
   * Add listener for <code>On Code Received</code> event from Phone Verification process.
   */
  addListener(
    eventName: 'cfaSignInPhoneOnCodeReceived',
    cb: (data: EventMapping['cfaSignInPhoneOnCodeReceived']) => void
  ): Promise<PluginListenerHandle> & PluginListenerHandle;

  /**
   * Remove all the listeners that are attached to this plugin.
   */
  removeAllListeners(): Promise<void>;
}

export type SignInResult = {
  providerId: string;
};

export type GoogleSignInResult = SignInResult & {
  idToken: string;
};

export type TwitterSignInResult = SignInResult & {
  idToken: string;
  secret: string;
};

export type FacebookSignInResult = SignInResult & {
  idToken: string;
};

export type AppleSignInResult = SignInResult & {
  idToken: string;
  rawNonce: string;
  accessToken: string;
  secret: string;
};

export type PhoneSignInResult = SignInResult & {
  verificationId: string;
  verificationCode: string;
};

export type PhoneSignInOptions = {
  container?: HTMLElement;
  phone: string;
  verificationCode?: string;
};

export type SignInOptionsMap = {
  ['google.com']: never;
  ['apple.com']: never;
  ['facebook.com']: never;
  ['twitter.com']: never;
  phone: PhoneSignInOptions;
};

export type SignInOptions = SignInOptionsMap[keyof SignInOptionsMap];
