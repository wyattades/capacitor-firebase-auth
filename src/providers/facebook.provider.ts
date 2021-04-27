import firebase from 'firebase/app';
import 'firebase/auth';
import {FacebookSignInResult, SignInOptions} from '../definitions';
import OAuthCredential = firebase.auth.OAuthCredential;

export const facebookSignInWeb: (options: {providerId: string, data?: SignInOptions}) => Promise<FacebookSignInResult>
    = async () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().useDeviceLanguage();

    const userCredential = await firebase.auth().signInWithPopup(provider);

    const {credential}: { credential: OAuthCredential; } = userCredential;
    return new FacebookSignInResult(credential.accessToken);
}

export const facebookLinkWeb: () => Promise<firebase.auth.UserCredential>
    = async () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().useDeviceLanguage();

    if (!firebase.auth().currentUser) {
        throw new Error('No user to link to');
    }
    return await firebase.auth().currentUser.linkWithPopup(provider);
}
