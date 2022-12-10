import firebase from 'firebase/app';
import 'firebase/auth';
import { registerPlugin } from '@capacitor/core';

import type {
  AppleSignInResult,
  CapacitorFirebaseAuthPlugin,
  FacebookSignInResult,
  GoogleSignInResult,
  PhoneSignInResult,
  TwitterSignInResult,
  SignInOptionsMap,
} from './definitions';

export const CapacitorFirebaseAuth =
  registerPlugin<CapacitorFirebaseAuthPlugin>('CapacitorFirebaseAuth', {
    web: async () => ({
      signIn: async () => {
        throw new Error('web not implemented');
      },
      link: async () => {
        throw new Error('web not implemented');
      },
      signOut: async () => {
        throw new Error('web not implemented');
      },
    }),
  });
const plugin = CapacitorFirebaseAuth;

abstract class BaseProvider {
  public static PROVIDER_ID: string;
}

type MaybePromise<T> = T | Promise<T>;

class AppleAuthProvider extends firebase.auth.OAuthProvider {
  public static PROVIDER_ID = 'apple.com';
  constructor() {
    super(AppleAuthProvider.PROVIDER_ID);
  }
}

const registerProvider = <Prov extends typeof BaseProvider, SignInResult>(
  Provider: Prov,
  buildCredential: (
    signInResult: SignInResult,
    Provider: Prov
  ) => MaybePromise<firebase.auth.OAuthCredential | null>
) => {
  return {
    providerId: Provider.PROVIDER_ID,
    Provider,
    buildCredential,
  };
};

const PROVIDER_MAP = {
  ['google.com']: registerProvider(
    firebase.auth.GoogleAuthProvider,
    ({ idToken }: GoogleSignInResult, Provider) => Provider.credential(idToken)
  ),
  ['apple.com']: registerProvider(
    AppleAuthProvider,
    ({ idToken, rawNonce }: AppleSignInResult, Provider) => {
      const provider = new Provider();
      provider.addScope('email');
      provider.addScope('name');
      return provider.credential({ idToken, rawNonce });
    }
  ),
  ['facebook.com']: registerProvider(
    firebase.auth.FacebookAuthProvider,
    ({ idToken }: FacebookSignInResult, Provider) =>
      Provider.credential(idToken)
  ),
  ['twitter.com']: registerProvider(
    firebase.auth.TwitterAuthProvider,
    ({ idToken, secret }: TwitterSignInResult, Provider) =>
      Provider.credential(idToken, secret)
  ),
  phone: registerProvider(
    firebase.auth.PhoneAuthProvider,
    ({ verificationId, verificationCode }: PhoneSignInResult, Provider) =>
      verificationCode
        ? Provider.credential(verificationId, verificationCode)
        : null
  ),
};

type SignInResultMap = {
  [K in keyof typeof PROVIDER_MAP]: Parameters<
    typeof PROVIDER_MAP[K]['buildCredential']
  >[0];
};

/**
 * Call the sign in method on native layer and sign in on web layer with retrieved credentials.
 */
export const signIn = async <ProviderId extends keyof typeof PROVIDER_MAP>(
  /** The provider ID or name. */
  providerId: ProviderId,
  /** Additional information for provider */
  ...[data]: SignInOptionsMap[ProviderId] extends never
    ? []
    : [data: SignInOptionsMap[ProviderId]]
) => {
  const config = PROVIDER_MAP[providerId];
  if (!config) throw new Error(`Provider ${providerId} not found`);

  const { Provider, buildCredential } = config;

  const signInResult = await plugin.signIn<SignInResultMap[ProviderId]>({
    providerId,
    data,
  });

  const oauthCred = await buildCredential(signInResult as any, Provider as any);
  if (!oauthCred) return null; // abort if no credential

  const userCredential = await firebase
    .app()
    .auth()
    .signInWithCredential(oauthCred);

  return { userCredential, result: signInResult };
};

/**
 * Call the link method on native layer and link on web layer with retrieved credentials.
 */
export const link = async <ProviderId extends keyof typeof PROVIDER_MAP>(
  /** The provider ID or name. */
  providerId: ProviderId,
  /** Additional information for provider */
  ...[data]: SignInOptionsMap[ProviderId] extends never
    ? []
    : [data: SignInOptionsMap[ProviderId]]
) => {
  const config = PROVIDER_MAP[providerId];
  if (!config) throw new Error(`Provider ${providerId} not found`);

  const { Provider, buildCredential } = config;

  const result = await plugin.link<SignInResultMap[ProviderId]>({
    providerId,
    data,
  });

  const oauthCred = await buildCredential(result as any, Provider as any);
  if (!oauthCred) return null; // abort if no credential

  // web link
  const authUser = firebase.app().auth().currentUser;
  if (!authUser) {
    throw new Error('No user to link to');
  }

  const userCredential = await authUser.linkWithCredential(oauthCred);

  return { userCredential, result };
};

/**
 * Call sign out method on native and web layers.
 */
export const signOut = async () => {
  // native sign out
  await plugin.signOut({});

  // web sign out
  await firebase.app().auth().signOut();
};
