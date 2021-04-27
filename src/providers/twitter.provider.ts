import firebase from 'firebase/app';
import 'firebase/auth';
import {SignInOptions, TwitterSignInResult} from '../definitions';
import OAuthCredential = firebase.auth.OAuthCredential;

export const twitterSignInWeb: (options: {providerId: string, data?: SignInOptions}) => Promise<TwitterSignInResult>
    = async () => {

    try {
        const provider = new firebase.auth.TwitterAuthProvider();
        firebase.auth().useDeviceLanguage();

        const userCredential = await firebase.auth().signInWithPopup(provider);

        const {credential}: { credential: OAuthCredential; } = userCredential;
        return new TwitterSignInResult(credential.accessToken, credential.secret);
    } catch (e) {
        return Promise.reject(e);
    }

}

export const twitterLinkWeb: (options: {providerId: string, data?: SignInOptions}) => Promise<TwitterSignInResult>
    = async () => {

    try {
        const provider = new firebase.auth.TwitterAuthProvider();
        firebase.auth().useDeviceLanguage();

        if (!firebase.auth().currentUser) {
            throw new Error('No user to link to');
        }
        const userCredential = await firebase.auth().currentUser.linkWithPopup(provider);

        const {credential}: { credential: OAuthCredential; } = userCredential;
        return new TwitterSignInResult(credential.accessToken, credential.secret);
    } catch (e) {
        return Promise.reject(e);
    }

}
