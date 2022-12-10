import firebase from 'firebase/app';
import 'firebase/auth';
import { registerPlugin, Capacitor } from '@capacitor/core';
import { Observable, throwError } from 'rxjs';

import {
  AppleSignInResult,
  CapacitorFirebaseAuthPlugin,
  FacebookSignInResult,
  GoogleSignInResult,
  PhoneSignInResult,
  TwitterSignInResult,
  SignInResult,
  SignInOptions,
} from './definitions';

export const CapacitorFirebaseAuth =
  registerPlugin<CapacitorFirebaseAuthPlugin>('CapacitorFirebaseAuth', {
    web: () => import('./web').then((m) => new m.CapacitorFirebaseAuthWeb()),
  });
const plugin = CapacitorFirebaseAuth;

export const cfaLink = (
  providerId: string,
  data?: SignInOptions
): Observable<{
  userCredential: firebase.auth.UserCredential;
  result?: SignInResult;
}> => {
  switch (providerId) {
    case firebase.auth.GoogleAuthProvider.PROVIDER_ID:
      return cfaLinkGoogle();
    case firebase.auth.TwitterAuthProvider.PROVIDER_ID:
      return cfaLinkTwitter();
    case firebase.auth.FacebookAuthProvider.PROVIDER_ID:
      return cfaLinkFacebook();
    case cfaSignInAppleProvider:
      return cfaLinkApple();
    case firebase.auth.PhoneAuthProvider.PROVIDER_ID:
      if (!data) {
        return throwError(
          new Error('Phone and Verification data must be provided.')
        );
      }
      return cfaLinkPhone(data.phone, data.verificationCode);
    default:
      return throwError(
        new Error(`The '${providerId}' provider was not supported`)
      );
  }
};

/**
 * Call the Google link method on native layer and links user on web layer with retrieved credentials.
 */
export const cfaLinkGoogle = (): Observable<{
  userCredential: firebase.auth.UserCredential;
  result?: GoogleSignInResult;
}> => {
  return new Observable((observer) => {
    // get the provider id
    const providerId = firebase.auth.GoogleAuthProvider.PROVIDER_ID;

    // Special handling on the web as we cannot link the auth provider twice
    if (Capacitor.getPlatform() === 'web') {
      plugin
        .link<firebase.auth.UserCredential>({ providerId })
        .then((userCredential) => {
          observer.next({ userCredential });
          observer.complete();
        })
        .catch((reject) => {
          observer.error(reject);
        });
      return;
    }

    // native link
    plugin
      .link<GoogleSignInResult>({ providerId })
      .then((result) => {
        // create the credentials
        const credential = firebase.auth.GoogleAuthProvider.credential(
          result.idToken
        );

        // web link
        const authUser = firebase.app().auth().currentUser;
        if (!authUser) {
          return observer.error(new Error('No user to link to'));
        }

        authUser
          .linkWithCredential(credential)
          .then((userCredential) => {
            observer.next({ userCredential, result });
            observer.complete();
          })
          .catch((reject: any) => {
            observer.error(reject);
          });
      })
      .catch((reject) => {
        observer.error(reject);
      });
  });
};

/**
 * Call the Twitter link method on native and link on web layer with retrieved credentials.
 */
export const cfaLinkTwitter = (): Observable<{
  userCredential: firebase.auth.UserCredential;
  result?: TwitterSignInResult;
}> => {
  return new Observable((observer) => {
    // get the provider id
    const providerId = firebase.auth.TwitterAuthProvider.PROVIDER_ID;

    // Special handling on the web as we cannot link the auth provider twice
    if (Capacitor.getPlatform() === 'web') {
      plugin
        .link<firebase.auth.UserCredential>({ providerId })
        .then((userCredential) => {
          observer.next({ userCredential });
          observer.complete();
        })
        .catch((reject) => {
          observer.error(reject);
        });
      return;
    }

    // native link
    plugin
      .link<TwitterSignInResult>({ providerId })
      .then((result) => {
        // create the credentials
        const credential = firebase.auth.TwitterAuthProvider.credential(
          result.idToken,
          result.secret
        );

        // web link
        const authUser = firebase.app().auth().currentUser;
        if (!authUser) {
          return observer.error(new Error('No user to link to'));
        }

        authUser
          .linkWithCredential(credential)
          .then((userCredential) => {
            observer.next({ userCredential, result });
            observer.complete();
          })
          .catch((reject: any) => observer.error(reject));
      })
      .catch((reject) => observer.error(reject));
  });
};

/**
 * Call the Facebook link method on native and link on web layer with retrieved credentials.
 */
export const cfaLinkFacebook = (): Observable<{
  userCredential: firebase.auth.UserCredential;
  result?: FacebookSignInResult;
}> => {
  return new Observable((observer) => {
    // get the provider id
    const providerId = firebase.auth.FacebookAuthProvider.PROVIDER_ID;

    // Special handling on the web as we cannot link the auth provider twice
    if (Capacitor.getPlatform() === 'web') {
      plugin
        .link<firebase.auth.UserCredential>({ providerId })
        .then((userCredential) => {
          observer.next({ userCredential });
          observer.complete();
        })
        .catch((reject) => {
          observer.error(reject);
        });
      return;
    }

    // native link
    plugin
      .link<FacebookSignInResult>({ providerId })
      .then((result) => {
        // create the credentials
        const credential = firebase.auth.FacebookAuthProvider.credential(
          result.idToken
        );

        // web link
        const authUser = firebase.app().auth().currentUser;
        if (!authUser) {
          return observer.error(new Error('No user to link to'));
        }

        authUser
          .linkWithCredential(credential)
          .then((userCredential) => {
            observer.next({ userCredential, result });
            observer.complete();
          })
          .catch((reject: any) => observer.error(reject));
      })
      .catch((reject) => observer.error(reject));
  });
};

/**
 * Call the Apple link method on native and link on web layer with retrieved credentials.
 */
export const cfaLinkApple = (): Observable<{
  userCredential: firebase.auth.UserCredential;
  result?: AppleSignInResult;
}> => {
  return new Observable((observer) => {
    // Special handling on the web as we cannot link the auth provider twice
    if (Capacitor.getPlatform() === 'web') {
      plugin
        .link<firebase.auth.UserCredential>({
          providerId: cfaSignInAppleProvider,
        })
        .then((userCredential) => {
          observer.next({ userCredential });
          observer.complete();
        })
        .catch((reject) => {
          observer.error(reject);
        });
      return;
    }

    // native link
    plugin
      .link<AppleSignInResult>({ providerId: cfaSignInAppleProvider })
      .then((result) => {
        const { idToken, rawNonce } = result;

        const provider = new firebase.auth.OAuthProvider('apple.com');
        provider.addScope('email');
        provider.addScope('name');

        const credential = provider.credential({ idToken, rawNonce });

        // web link
        const authUser = firebase.app().auth().currentUser;
        if (!authUser) {
          return observer.error(new Error('No user to link to'));
        }

        authUser
          .linkWithCredential(credential)
          .then((userCredential) => {
            observer.next({ userCredential, result });
            observer.complete();
          })
          .catch((reject: any) => observer.error(reject));
      })
      .catch((reject) => observer.error(reject));
  });
};

/**
 * Call the Phone verification link, handling send and retrieve to code on native, but only link on web with retrieved credentials.
 * @param phone The user phone number.
 * @param verificationCode The verification code sent by SMS (optional).
 */
export const cfaLinkPhone = (
  phone: string,
  verificationCode?: string
): Observable<{
  userCredential: firebase.auth.UserCredential;
  result?: PhoneSignInResult;
}> => {
  return new Observable((observer) => {
    // get the provider id
    const providerId = firebase.auth.PhoneAuthProvider.PROVIDER_ID;

    // Special handling on the web as we cannot link the auth provider twice
    if (Capacitor.getPlatform() === 'web') {
      plugin
        .link<firebase.auth.UserCredential>({ providerId })
        .then((userCredential) => {
          observer.next({ userCredential });
          observer.complete();
        })
        .catch((reject) => {
          observer.error(reject);
        });
      return;
    }

    plugin
      .link<PhoneSignInResult>({
        providerId,
        data: { phone, verificationCode },
      })
      .then((result) => {
        // if there is no verification code
        if (!result.verificationCode) {
          return observer.complete();
        }

        // create the credentials
        const credential = firebase.auth.PhoneAuthProvider.credential(
          result.verificationId,
          result.verificationCode
        );

        // web link
        const authUser = firebase.app().auth().currentUser;
        if (!authUser) {
          return observer.error(new Error('No user to link to'));
        }

        authUser
          .linkWithCredential(credential)
          .then((userCredential) => {
            observer.next({ userCredential, result });
            observer.complete();
          })
          .catch((reject: any) => observer.error(reject));
      })
      .catch((reject) => observer.error(reject));
  });
};

/**
 * Call the sign in method on native layer and sign in on web layer with retrieved credentials.
 * @param providerId The provider identification.
 * @param data The provider additional information (optional).
 */
export const cfaSignIn = (
  providerId: string,
  data?: SignInOptions
): Observable<{
  userCredential: firebase.auth.UserCredential;
  result: SignInResult;
}> => {
  switch (providerId) {
    case firebase.auth.GoogleAuthProvider.PROVIDER_ID:
      return cfaSignInGoogle();
    case firebase.auth.TwitterAuthProvider.PROVIDER_ID:
      return cfaSignInTwitter();
    case firebase.auth.FacebookAuthProvider.PROVIDER_ID:
      return cfaSignInFacebook();
    case cfaSignInAppleProvider:
      return cfaSignInApple();
    case firebase.auth.PhoneAuthProvider.PROVIDER_ID:
      if (!data) {
        return throwError(
          new Error('Phone and Verification data must be provided.')
        );
      }
      return cfaSignInPhone(data.phone, data.verificationCode);
    default:
      return throwError(
        new Error(`The '${providerId}' provider was not supported`)
      );
  }
};

/**
 * Call the Google sign in method on native layer and sign in on web layer with retrieved credentials.
 */
export const cfaSignInGoogle = (): Observable<{
  userCredential: firebase.auth.UserCredential;
  result: GoogleSignInResult;
}> => {
  return new Observable((observer) => {
    // get the provider id
    const providerId = firebase.auth.GoogleAuthProvider.PROVIDER_ID;

    // native sign in
    plugin
      .signIn<GoogleSignInResult>({ providerId })
      .then((result: GoogleSignInResult) => {
        // create the credentials
        const credential = firebase.auth.GoogleAuthProvider.credential(
          result.idToken
        );

        // web sign in
        firebase
          .app()
          .auth()
          .signInWithCredential(credential)
          .then((userCredential) => {
            observer.next({ userCredential, result });
            observer.complete();
          })
          .catch((reject: any) => {
            observer.error(reject);
          });
      })
      .catch((reject: any) => {
        observer.error(reject);
      });
  });
};

/**
 * Call the Twitter sign in method on native and sign in on web layer with retrieved credentials.
 */
export const cfaSignInTwitter = (): Observable<{
  userCredential: firebase.auth.UserCredential;
  result: TwitterSignInResult;
}> => {
  return new Observable((observer) => {
    // get the provider id
    const providerId = firebase.auth.TwitterAuthProvider.PROVIDER_ID;

    // native sign in
    plugin
      .signIn<TwitterSignInResult>({ providerId })
      .then((result) => {
        // create the credentials
        const credential = firebase.auth.TwitterAuthProvider.credential(
          result.idToken,
          result.secret
        );

        // web sign in
        firebase
          .app()
          .auth()
          .signInWithCredential(credential)
          .then((userCredential) => {
            observer.next({ userCredential, result });
            observer.complete();
          })
          .catch((reject: any) => observer.error(reject));
      })
      .catch((reject: any) => observer.error(reject));
  });
};

/**
 * Call the Facebook sign in method on native and sign in on web layer with retrieved credentials.
 */
export const cfaSignInFacebook = (): Observable<{
  userCredential: firebase.auth.UserCredential;
  result: FacebookSignInResult;
}> => {
  return new Observable((observer) => {
    // get the provider id
    const providerId = firebase.auth.FacebookAuthProvider.PROVIDER_ID;

    // native sign in
    plugin
      .signIn<FacebookSignInResult>({ providerId })
      .then((result) => {
        // create the credentials
        const credential = firebase.auth.FacebookAuthProvider.credential(
          result.idToken
        );

        // TODO: add scopes here?
        // const provider = new firebase.auth.OAuthProvider('facebook.com');
        // provider.addScope('email');
        // const credential = provider.credential({  idToken: result.idToken });

        // web sign in
        firebase
          .app()
          .auth()
          .signInWithCredential(credential)
          .then((userCredential) => {
            observer.next({ userCredential, result });
            observer.complete();
          })
          .catch((reject: any) => observer.error(reject));
      })
      .catch((reject: any) => observer.error(reject));
  });
};

export const cfaSignInAppleProvider = 'apple.com';

/**
 * Call the Apple sign in method on native and sign in on web layer with retrieved credentials.
 */
export const cfaSignInApple = (): Observable<{
  userCredential: firebase.auth.UserCredential;
  result: AppleSignInResult;
}> => {
  return new Observable((observer) => {
    // native sign in
    plugin
      .signIn<AppleSignInResult>({ providerId: cfaSignInAppleProvider })
      .then((result) => {
        const { idToken, rawNonce } = result;

        const provider = new firebase.auth.OAuthProvider('apple.com');
        provider.addScope('email');
        provider.addScope('name');

        const credential = provider.credential({ idToken, rawNonce });

        // web sign in
        firebase
          .app()
          .auth()
          .signInWithCredential(credential)
          .then((userCredential) => {
            observer.next({ userCredential, result });
            observer.complete();
          })
          .catch((reject: any) => observer.error(reject));
      })
      .catch((reject: any) => observer.error(reject));
  });
};

/**
 * Call the Phone verification sign in, handling send and retrieve to code on native, but only sign in on web with retrieved credentials.
 * @param phone The user phone number.
 * @param verificationCode The verification code sent by SMS (optional).
 */
export const cfaSignInPhone = (
  phone: string,
  verificationCode?: string
): Observable<{
  userCredential: firebase.auth.UserCredential;
  result: PhoneSignInResult;
}> => {
  return new Observable((observer) => {
    // get the provider id
    const providerId = firebase.auth.PhoneAuthProvider.PROVIDER_ID;

    plugin
      .signIn<PhoneSignInResult>({
        providerId,
        data: { phone, verificationCode },
      })
      .then((result) => {
        // if there is no verification code
        if (!result.verificationCode) {
          return observer.complete();
        }

        // create the credentials
        const credential = firebase.auth.PhoneAuthProvider.credential(
          result.verificationId,
          result.verificationCode
        );

        // web sign in
        firebase
          .app()
          .auth()
          .signInWithCredential(credential)
          .then((userCredential) => {
            observer.next({ userCredential, result });
            observer.complete();
          })
          .catch((reject: any) => observer.error(reject));
      })
      .catch((reject: any) => observer.error(reject));
  });
};

/**
 * Observable of one notification of <code>On Code Sent</code>event from Phone Verification process.
 */
export const cfaSignInPhoneOnCodeSent = (): Observable<string> => {
  return new Observable<string>((observer) => {
    // @ts-ignore
    return plugin.addListener(
      'cfaSignInPhoneOnCodeSent',
      (event: { verificationId: string }) => {
        observer.next(event.verificationId);
        observer.complete();
      }
    );
  });
};

/**
 * Observable of one notification of <code>On Code Received</code> event from Phone Verification process.
 */
export const cfaSignInPhoneOnCodeReceived = (): Observable<{
  verificationId: string;
  verificationCode: string;
}> => {
  return new Observable<{ verificationId: string; verificationCode: string }>(
    (observer) => {
      // @ts-ignore
      return plugin.addListener(
        'cfaSignInPhoneOnCodeReceived',
        (event: { verificationId: string; verificationCode: string }) => {
          observer.next(event);
          observer.complete();
        }
      );
    }
  );
};

/**
 * Call Google sign out method on native and web layers.
 */
export const cfaSignOut = (): Observable<void> => {
  return new Observable((observer) => {
    plugin.signOut({}).then(() => {
      // web sign out
      firebase
        .app()
        .auth()
        .signOut()
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((reject: any) => observer.error(reject));
    });
  });
};
