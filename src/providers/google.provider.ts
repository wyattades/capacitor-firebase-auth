import firebase from 'firebase/app';
import 'firebase/auth';
import {GoogleSignInResult, SignInOptions} from '../definitions';
import OAuthCredential = firebase.auth.OAuthCredential;

export const googleSignInWeb: (options: {providerId: string, data?: SignInOptions}) => Promise<GoogleSignInResult>
    = async () => {
        try {

            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().useDeviceLanguage();

            const userCredential = await firebase.auth().signInWithPopup(provider);

            const {credential}: { credential: OAuthCredential } = userCredential;
            return new GoogleSignInResult(credential.idToken);

        } catch (e) {
            return Promise.reject(e);
        }
    }

export const googleLinkWeb: () => Promise<firebase.auth.UserCredential>
    = async () => {
        try {

            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().useDeviceLanguage();

            if (!firebase.auth().currentUser) {
                throw new Error('No user to link to');
            }
            return await firebase.auth().currentUser.linkWithPopup(provider);
        } catch (e) {
            return Promise.reject(e);
        }
    }
