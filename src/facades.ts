import 'firebase/auth';
import {registerPlugin} from '@capacitor/core';

import firebase from 'firebase/app';
import { Observable, throwError } from 'rxjs';

import {
  AppleSignInResult, CapacitorFirebaseAuthPlugin, FacebookSignInResult, GoogleSignInResult,
  PhoneSignInResult, SignInOptions, TwitterSignInResult
} from './definitions';

export const CapacitorFirebaseAuth = registerPlugin<CapacitorFirebaseAuthPlugin>('CapacitorFirebaseAuth', {
    web: () => import('./web').then(m => new m.CapacitorFirebaseAuthWeb()),
});
const plugin: CapacitorFirebaseAuthPlugin = CapacitorFirebaseAuth;

export const cfaLink = (providerId: string): Observable<firebase.auth.UserCredential> => {
	const googleProvider = firebase.auth.GoogleAuthProvider.PROVIDER_ID;
	const facebookProvider = firebase.auth.FacebookAuthProvider.PROVIDER_ID;
	const twitterProvider = firebase.auth.TwitterAuthProvider.PROVIDER_ID;
	const phoneProvider = firebase.auth.PhoneAuthProvider.PROVIDER_ID;
	switch (providerId) {
		case googleProvider:
			return cfaLinkGoogle();
		case twitterProvider:
			return cfaLinkTwitter();
		case facebookProvider:
			return cfaLinkFacebook();
        case cfaSignInAppleProvider:
            return cfaLinkApple();
		case phoneProvider:
			return cfaLinkPhone();
		default:
			return throwError(new Error(`The '${providerId}' provider was not supported`));
	}
};

/**
 * Call the Google link method on native layer and links user on web layer with retrieved credentials.
 */
export const cfaLinkGoogle = (): Observable<firebase.auth.UserCredential> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = firebase.auth.GoogleAuthProvider.PROVIDER_ID;

		// Special handling on the web as we cannot link the auth provider twice
		if (Capacitor.platform === 'web') {
			plugin.link({providerId}).then((result: firebase.auth.UserCredential) => {
				observer.next(result);
				observer.complete();
			}).catch(reject => {
				observer.error(reject);
			});
			return;
		}

		// native link
		plugin.link({providerId}).then((result: GoogleSignInResult) => {
			// create the credentials
			const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken);

			// web link
			if (!firebase.app().auth().currentUser) {
				return observer.error(new Error('No user to link to'));
			}

			firebase.app().auth().currentUser.linkWithCredential(credential)
				.then((userCredential: firebase.auth.UserCredential) => {
					observer.next(userCredential);
					observer.complete();
				})
				.catch((reject: any) => {
					observer.error(reject);
				});
		}).catch(reject => {
			observer.error(reject);
		});
	});
};

/**
 * Call the Twitter link method on native and link on web layer with retrieved credentials.
 */
export const cfaLinkTwitter = (): Observable<firebase.auth.UserCredential> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = firebase.auth.TwitterAuthProvider.PROVIDER_ID;

		// Special handling on the web as we cannot link the auth provider twice
		if (Capacitor.platform === 'web') {
			plugin.link({providerId}).then((result: firebase.auth.UserCredential) => {
				observer.next(result);
				observer.complete();
			}).catch(reject => {
				observer.error(reject);
			});
			return;
		}

		// native link
		plugin.link({providerId}).then((result :TwitterSignInResult) => {
			// create the credentials
			const credential = firebase.auth.TwitterAuthProvider.credential(result.idToken, result.secret);

			// web link
			if (!firebase.app().auth().currentUser) {
				return observer.error(new Error('No user to link to'));
			}

			firebase.app().auth().currentUser.linkWithCredential(credential)
				.then((userCredential: firebase.auth.UserCredential) => {
					observer.next(userCredential);
					observer.complete();
				})
				.catch((reject: any) => observer.error(reject));

		}).catch(reject => observer.error(reject));
	});
};

/**
 * Call the Facebook link method on native and link on web layer with retrieved credentials.
 */
export const cfaLinkFacebook = (): Observable<firebase.auth.UserCredential> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = firebase.auth.FacebookAuthProvider.PROVIDER_ID;

		// Special handling on the web as we cannot link the auth provider twice
		if (Capacitor.platform === 'web') {
			plugin.link({providerId}).then((result: firebase.auth.UserCredential) => {
				observer.next(result);
				observer.complete();
			}).catch(reject => {
				observer.error(reject);
			});
			return;
		}

		// native link
		plugin.link({providerId}).then((result: FacebookSignInResult) => {
			// create the credentials
			const credential = firebase.auth.FacebookAuthProvider.credential(result.idToken);

			// web link
			if (!firebase.app().auth().currentUser) {
				return observer.error(new Error('No user to link to'));
			}

			firebase.app().auth().currentUser.linkWithCredential(credential)
				.then((userCredential: firebase.auth.UserCredential) => {
					observer.next(userCredential);
					observer.complete();
				})
				.catch((reject: any) => observer.error(reject));

		}).catch(reject => observer.error(reject));
	});
};

/**
 * Call the Apple link method on native and link on web layer with retrieved credentials.
 */
export const cfaLinkApple = (): Observable<firebase.auth.UserCredential> => {
    return new Observable(observer => {
		// Special handling on the web as we cannot link the auth provider twice
		if (Capacitor.platform === 'web') {
			plugin.link({providerId: cfaSignInAppleProvider}).then((result: firebase.auth.UserCredential) => {
				observer.next(result);
				observer.complete();
			}).catch(reject => {
				observer.error(reject);
			});
			return;
		}

        // native link
        plugin.link({providerId: cfaSignInAppleProvider}).then((result: AppleSignInResult) => {
            const {idToken, rawNonce} = result;

            const provider = new firebase.auth.OAuthProvider('apple.com');
            provider.addScope('email');
            provider.addScope('name');

            const credential = provider.credential({idToken, rawNonce})

            // web link
			if (!firebase.app().auth().currentUser) {
				return observer.error(new Error('No user to link to'));
			}

            firebase.app().auth().currentUser.linkWithCredential(credential)
                .then((userCredential: firebase.auth.UserCredential) => {
                    observer.next(userCredential);
                    observer.complete();
                })
                .catch((reject: any) => observer.error(reject));
        }).catch(reject => observer.error(reject));
    });
}

/**
 * Call the Phone verification link, handling send and retrieve to code on native, but only link on web with retrieved credentials.
 * @param phone The user phone number.
 * @param verificationCode The verification code sent by SMS (optional).
 */
export const cfaLinkPhone = () : Observable<firebase.auth.UserCredential>  => {
	return new Observable(observer => {
		// get the provider id
		const providerId = firebase.auth.PhoneAuthProvider.PROVIDER_ID;

		// Special handling on the web as we cannot link the auth provider twice
		if (Capacitor.platform === 'web') {
			plugin.link({providerId}).then((result: firebase.auth.UserCredential) => {
				observer.next(result);
				observer.complete();
			}).catch(reject => {
				observer.error(reject);
			});
			return;
		}

		plugin.link({providerId}).then((result: PhoneSignInResult) => {
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

			firebase.app().auth().currentUser.linkWithCredential(credential)
				.then((userCredential: firebase.auth.UserCredential) => {
					observer.next(userCredential);
					observer.complete();
				})
				.catch((reject: any) => observer.error(reject));

		}).catch(reject => observer.error(reject));

	});
};

/**
 * Call the sign in method on native layer and sign in on web layer with retrieved credentials.
 * @param providerId The provider identification.
 * @param data The provider additional information (optional).
 */
export const cfaSignIn = (providerId: string, data?: SignInOptions): Observable<firebase.User> => {
	const googleProvider = new firebase.auth.GoogleAuthProvider().providerId;
	const facebookProvider = new firebase.auth.FacebookAuthProvider().providerId;
	const twitterProvider = new firebase.auth.TwitterAuthProvider().providerId;
	const phoneProvider = new firebase.auth.PhoneAuthProvider().providerId;
	switch (providerId) {
		case googleProvider:
			return cfaSignInGoogle();
		case twitterProvider:
			return cfaSignInTwitter();
		case facebookProvider:
			return cfaSignInFacebook();
		case cfaSignInAppleProvider:
			return cfaSignInApple();
		case phoneProvider:
			if (!data) {
				throw new Error('Phone and Verification data must be provided.')
			}
			return cfaSignInPhone(data.phone, data.verificationCode);
		default:
			return throwError(new Error(`The '${providerId}' provider was not supported`));
	}
};

/**
 * Call the Google sign in method on native layer and sign in on web layer with retrieved credentials.
 */
export const cfaSignInGoogle = (): Observable<firebase.User> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = firebase.auth.GoogleAuthProvider.PROVIDER_ID;

		// native sign in
		plugin.signIn<GoogleSignInResult>({ providerId }).then((result: GoogleSignInResult) => {
			// create the credentials
			const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken);

			// web sign in
			firebase.app().auth().signInWithCredential(credential)
				.then((userCredential: firebase.auth.UserCredential) => {
					if(!userCredential.user) {
						throw new Error('Firebase User was not received.')
					}
					observer.next(userCredential.user);
					observer.complete();
				})
				.catch((reject: any) => {
					observer.error(reject);
				});
		}).catch((reject: any) => {
			observer.error(reject);
		});
	});
};

/**
 * Call the Twitter sign in method on native and sign in on web layer with retrieved credentials.
 */
export const cfaSignInTwitter = (): Observable<firebase.User> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = firebase.auth.TwitterAuthProvider.PROVIDER_ID;

		// native sign in
		plugin.signIn<TwitterSignInResult>({ providerId }).then((result: TwitterSignInResult) => {
			// create the credentials
			const credential = firebase.auth.TwitterAuthProvider.credential(result.idToken, result.secret);

			// web sign in
			firebase.app().auth().signInWithCredential(credential)
				.then((userCredential: firebase.auth.UserCredential) => {
					if(!userCredential.user) {
						throw new Error('Firebase User was not received.')
					}
					observer.next(userCredential.user);
					observer.complete();
				})
				.catch((reject: any) => observer.error(reject));

		}).catch((reject: any) => observer.error(reject));
	});
};

/**
 * Call the Facebook sign in method on native and sign in on web layer with retrieved credentials.
 */
export const cfaSignInFacebook = (): Observable<firebase.User> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = firebase.auth.FacebookAuthProvider.PROVIDER_ID;

		// native sign in
		plugin.signIn<FacebookSignInResult>({ providerId }).then((result: FacebookSignInResult) => {
			// create the credentials
			const credential = firebase.auth.FacebookAuthProvider.credential(result.idToken);

			// web sign in
			firebase.app().auth().signInWithCredential(credential)
				.then((userCredential: firebase.auth.UserCredential) => {
					if(!userCredential.user) {
						throw new Error('Firebase User was not received.')
					}
					observer.next(userCredential.user);
					observer.complete();
				})
				.catch((reject: any) => observer.error(reject));

		}).catch((reject: any) => observer.error(reject));
	});
};

export const cfaSignInAppleProvider = 'apple.com';

/**
 * Call the Apple sign in method on native and sign in on web layer with retrieved credentials.
 */
export const cfaSignInApple = (): Observable<firebase.User> => {
	return new Observable(observer => {
		// native sign in
		plugin.signIn<AppleSignInResult>({ providerId: cfaSignInAppleProvider }).then((result: AppleSignInResult) => {
			const { idToken, rawNonce } = result;

			const provider = new firebase.auth.OAuthProvider('apple.com');
			provider.addScope('email');
			provider.addScope('name');

			const credential = provider.credential({ idToken, rawNonce })

			// web sign in
			firebase.app().auth().signInWithCredential(credential)
				.then((userCredential: firebase.auth.UserCredential) => {
					if(!userCredential.user) {
						throw new Error('Firebase User was not received.')
					}
					observer.next(userCredential.user);
					observer.complete();
				})
				.catch((reject: any) => observer.error(reject));
		}).catch((reject: any) => observer.error(reject));
	});
}

/**
 * Call the Phone verification sign in, handling send and retrieve to code on native, but only sign in on web with retrieved credentials.
 * @param phone The user phone number.
 * @param verificationCode The verification code sent by SMS (optional).
 */
export const cfaSignInPhone = (phone: string, verificationCode?: string): Observable<firebase.User> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = firebase.auth.PhoneAuthProvider.PROVIDER_ID;

		plugin.signIn<PhoneSignInResult>({ providerId, data: { phone, verificationCode } }).then((result: PhoneSignInResult) => {
			// if there is no verification code
			if (!result.verificationCode) {
				return observer.complete();
			}

			// create the credentials
			const credential = firebase.auth.PhoneAuthProvider.credential(result.verificationId, result.verificationCode);

			// web sign in
			firebase.app().auth().signInWithCredential(credential)
				.then((userCredential: firebase.auth.UserCredential) => {
					if(!userCredential.user) {
						throw new Error('Firebase User was not received.')
					}
					observer.next(userCredential.user);
					observer.complete();
				})
				.catch((reject: any) => observer.error(reject));

		}).catch((reject: any) => observer.error(reject));

	});
};

/**
 * Observable of one notification of <code>On Code Sent</code>event from Phone Verification process.
 */
export const cfaSignInPhoneOnCodeSent = (): Observable<string> => {
	return new Observable<string>(observer => {
		// @ts-ignore
		return plugin.addListener('cfaSignInPhoneOnCodeSent', (event: { verificationId: string }) => {
			observer.next(event.verificationId);
			observer.complete();
		});
	});
};

/**
 * Observable of one notification of <code>On Code Received</code> event from Phone Verification process.
 */
export const cfaSignInPhoneOnCodeReceived = (): Observable<{ verificationId: string, verificationCode: string }> => {
	return new Observable<{ verificationId: string, verificationCode: string }>(observer => {
		// @ts-ignore
		return plugin.addListener('cfaSignInPhoneOnCodeReceived', (event: { verificationId: string, verificationCode: string }) => {
			observer.next(event);
			observer.complete();
		});
	});
};

/**
 * Call Google sign out method on native and web layers.
 */
export const cfaSignOut = (): Observable<void> => {
	return new Observable(observer => {
		plugin.signOut({}).then(() => {
			// web sign out
			firebase.app().auth().signOut()
				.then(() => {
					observer.next();
					observer.complete();
				})
				.catch((reject: any) => observer.error(reject));
		});
	});
};
