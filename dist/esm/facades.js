import firebase from 'firebase/app';
import 'firebase/auth';
import { registerPlugin, Capacitor } from '@capacitor/core';
import { Observable, throwError } from 'rxjs';
export const CapacitorFirebaseAuth = registerPlugin('CapacitorFirebaseAuth', {
    web: () => import('./web').then((m) => new m.CapacitorFirebaseAuthWeb()),
});
const plugin = CapacitorFirebaseAuth;
export const cfaLink = (providerId, data) => {
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
                return throwError(new Error('Phone and Verification data must be provided.'));
            }
            return cfaLinkPhone(data.phone, data.verificationCode);
        default:
            return throwError(new Error(`The '${providerId}' provider was not supported`));
    }
};
/**
 * Call the Google link method on native layer and links user on web layer with retrieved credentials.
 */
export const cfaLinkGoogle = () => {
    return new Observable((observer) => {
        // get the provider id
        const providerId = firebase.auth.GoogleAuthProvider.PROVIDER_ID;
        // Special handling on the web as we cannot link the auth provider twice
        if (Capacitor.getPlatform() === 'web') {
            plugin
                .link({ providerId })
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
            .link({ providerId })
            .then((result) => {
            // create the credentials
            const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken);
            // web link
            if (!firebase.app().auth().currentUser) {
                return observer.error(new Error('No user to link to'));
            }
            firebase
                .app()
                .auth()
                .currentUser.linkWithCredential(credential)
                .then((userCredential) => {
                observer.next({ userCredential, result });
                observer.complete();
            })
                .catch((reject) => {
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
export const cfaLinkTwitter = () => {
    return new Observable((observer) => {
        // get the provider id
        const providerId = firebase.auth.TwitterAuthProvider.PROVIDER_ID;
        // Special handling on the web as we cannot link the auth provider twice
        if (Capacitor.getPlatform() === 'web') {
            plugin
                .link({ providerId })
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
            .link({ providerId })
            .then((result) => {
            // create the credentials
            const credential = firebase.auth.TwitterAuthProvider.credential(result.idToken, result.secret);
            // web link
            if (!firebase.app().auth().currentUser) {
                return observer.error(new Error('No user to link to'));
            }
            firebase
                .app()
                .auth()
                .currentUser.linkWithCredential(credential)
                .then((userCredential) => {
                observer.next({ userCredential, result });
                observer.complete();
            })
                .catch((reject) => observer.error(reject));
        })
            .catch((reject) => observer.error(reject));
    });
};
/**
 * Call the Facebook link method on native and link on web layer with retrieved credentials.
 */
export const cfaLinkFacebook = () => {
    return new Observable((observer) => {
        // get the provider id
        const providerId = firebase.auth.FacebookAuthProvider.PROVIDER_ID;
        // Special handling on the web as we cannot link the auth provider twice
        if (Capacitor.getPlatform() === 'web') {
            plugin
                .link({ providerId })
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
            .link({ providerId })
            .then((result) => {
            // create the credentials
            const credential = firebase.auth.FacebookAuthProvider.credential(result.idToken);
            // web link
            if (!firebase.app().auth().currentUser) {
                return observer.error(new Error('No user to link to'));
            }
            firebase
                .app()
                .auth()
                .currentUser.linkWithCredential(credential)
                .then((userCredential) => {
                observer.next({ userCredential, result });
                observer.complete();
            })
                .catch((reject) => observer.error(reject));
        })
            .catch((reject) => observer.error(reject));
    });
};
/**
 * Call the Apple link method on native and link on web layer with retrieved credentials.
 */
export const cfaLinkApple = () => {
    return new Observable((observer) => {
        // Special handling on the web as we cannot link the auth provider twice
        if (Capacitor.getPlatform() === 'web') {
            plugin
                .link({ providerId: cfaSignInAppleProvider })
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
            .link({ providerId: cfaSignInAppleProvider })
            .then((result) => {
            const { idToken, rawNonce } = result;
            const provider = new firebase.auth.OAuthProvider('apple.com');
            provider.addScope('email');
            provider.addScope('name');
            const credential = provider.credential({ idToken, rawNonce });
            // web link
            if (!firebase.app().auth().currentUser) {
                return observer.error(new Error('No user to link to'));
            }
            firebase
                .app()
                .auth()
                .currentUser.linkWithCredential(credential)
                .then((userCredential) => {
                observer.next({ userCredential, result });
                observer.complete();
            })
                .catch((reject) => observer.error(reject));
        })
            .catch((reject) => observer.error(reject));
    });
};
/**
 * Call the Phone verification link, handling send and retrieve to code on native, but only link on web with retrieved credentials.
 * @param phone The user phone number.
 * @param verificationCode The verification code sent by SMS (optional).
 */
export const cfaLinkPhone = (phone, verificationCode) => {
    return new Observable((observer) => {
        // get the provider id
        const providerId = firebase.auth.PhoneAuthProvider.PROVIDER_ID;
        // Special handling on the web as we cannot link the auth provider twice
        if (Capacitor.getPlatform() === 'web') {
            plugin
                .link({ providerId })
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
            .link({
            providerId,
            data: { phone, verificationCode },
        })
            .then((result) => {
            // if there is no verification code
            if (!result.verificationCode) {
                return observer.complete();
            }
            // create the credentials
            const credential = firebase.auth.PhoneAuthProvider.credential(result.verificationId, result.verificationCode);
            // web link
            if (!firebase.app().auth().currentUser) {
                return observer.error(new Error('No user to link to'));
            }
            firebase
                .app()
                .auth()
                .currentUser.linkWithCredential(credential)
                .then((userCredential) => {
                observer.next({ userCredential, result });
                observer.complete();
            })
                .catch((reject) => observer.error(reject));
        })
            .catch((reject) => observer.error(reject));
    });
};
/**
 * Call the sign in method on native layer and sign in on web layer with retrieved credentials.
 * @param providerId The provider identification.
 * @param data The provider additional information (optional).
 */
export const cfaSignIn = (providerId, data) => {
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
                return throwError(new Error('Phone and Verification data must be provided.'));
            }
            return cfaSignInPhone(data.phone, data.verificationCode);
        default:
            return throwError(new Error(`The '${providerId}' provider was not supported`));
    }
};
/**
 * Call the Google sign in method on native layer and sign in on web layer with retrieved credentials.
 */
export const cfaSignInGoogle = () => {
    return new Observable((observer) => {
        // get the provider id
        const providerId = firebase.auth.GoogleAuthProvider.PROVIDER_ID;
        // native sign in
        plugin
            .signIn({ providerId })
            .then((result) => {
            // create the credentials
            const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken);
            // web sign in
            firebase
                .app()
                .auth()
                .signInWithCredential(credential)
                .then((userCredential) => {
                observer.next({ userCredential, result });
                observer.complete();
            })
                .catch((reject) => {
                observer.error(reject);
            });
        })
            .catch((reject) => {
            observer.error(reject);
        });
    });
};
/**
 * Call the Twitter sign in method on native and sign in on web layer with retrieved credentials.
 */
export const cfaSignInTwitter = () => {
    return new Observable((observer) => {
        // get the provider id
        const providerId = firebase.auth.TwitterAuthProvider.PROVIDER_ID;
        // native sign in
        plugin
            .signIn({ providerId })
            .then((result) => {
            // create the credentials
            const credential = firebase.auth.TwitterAuthProvider.credential(result.idToken, result.secret);
            // web sign in
            firebase
                .app()
                .auth()
                .signInWithCredential(credential)
                .then((userCredential) => {
                observer.next({ userCredential, result });
                observer.complete();
            })
                .catch((reject) => observer.error(reject));
        })
            .catch((reject) => observer.error(reject));
    });
};
/**
 * Call the Facebook sign in method on native and sign in on web layer with retrieved credentials.
 */
export const cfaSignInFacebook = () => {
    return new Observable((observer) => {
        // get the provider id
        const providerId = firebase.auth.FacebookAuthProvider.PROVIDER_ID;
        // native sign in
        plugin
            .signIn({ providerId })
            .then((result) => {
            // create the credentials
            const credential = firebase.auth.FacebookAuthProvider.credential(result.idToken);
            // web sign in
            firebase
                .app()
                .auth()
                .signInWithCredential(credential)
                .then((userCredential) => {
                observer.next({ userCredential, result });
                observer.complete();
            })
                .catch((reject) => observer.error(reject));
        })
            .catch((reject) => observer.error(reject));
    });
};
export const cfaSignInAppleProvider = 'apple.com';
/**
 * Call the Apple sign in method on native and sign in on web layer with retrieved credentials.
 */
export const cfaSignInApple = () => {
    return new Observable((observer) => {
        // native sign in
        plugin
            .signIn({ providerId: cfaSignInAppleProvider })
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
                .catch((reject) => observer.error(reject));
        })
            .catch((reject) => observer.error(reject));
    });
};
/**
 * Call the Phone verification sign in, handling send and retrieve to code on native, but only sign in on web with retrieved credentials.
 * @param phone The user phone number.
 * @param verificationCode The verification code sent by SMS (optional).
 */
export const cfaSignInPhone = (phone, verificationCode) => {
    return new Observable((observer) => {
        // get the provider id
        const providerId = firebase.auth.PhoneAuthProvider.PROVIDER_ID;
        plugin
            .signIn({
            providerId,
            data: { phone, verificationCode },
        })
            .then((result) => {
            // if there is no verification code
            if (!result.verificationCode) {
                return observer.complete();
            }
            // create the credentials
            const credential = firebase.auth.PhoneAuthProvider.credential(result.verificationId, result.verificationCode);
            // web sign in
            firebase
                .app()
                .auth()
                .signInWithCredential(credential)
                .then((userCredential) => {
                observer.next({ userCredential, result });
                observer.complete();
            })
                .catch((reject) => observer.error(reject));
        })
            .catch((reject) => observer.error(reject));
    });
};
/**
 * Observable of one notification of <code>On Code Sent</code>event from Phone Verification process.
 */
export const cfaSignInPhoneOnCodeSent = () => {
    return new Observable((observer) => {
        // @ts-ignore
        return plugin.addListener('cfaSignInPhoneOnCodeSent', (event) => {
            observer.next(event.verificationId);
            observer.complete();
        });
    });
};
/**
 * Observable of one notification of <code>On Code Received</code> event from Phone Verification process.
 */
export const cfaSignInPhoneOnCodeReceived = () => {
    return new Observable((observer) => {
        // @ts-ignore
        return plugin.addListener('cfaSignInPhoneOnCodeReceived', (event) => {
            observer.next(event);
            observer.complete();
        });
    });
};
/**
 * Call Google sign out method on native and web layers.
 */
export const cfaSignOut = () => {
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
                .catch((reject) => observer.error(reject));
        });
    });
};
//# sourceMappingURL=facades.js.map