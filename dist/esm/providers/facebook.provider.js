import firebase from 'firebase/app';
import 'firebase/auth';
import { FacebookSignInResult } from '../definitions';
export const facebookSignInWeb = async () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().useDeviceLanguage();
    const userCredential = await firebase.auth().signInWithPopup(provider);
    const credential = userCredential === null || userCredential === void 0 ? void 0 : userCredential.credential;
    return new FacebookSignInResult(credential === null || credential === void 0 ? void 0 : credential.accessToken);
};
export const facebookLinkWeb = async () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().useDeviceLanguage();
    if (!firebase.auth().currentUser) {
        throw new Error('No user to link to');
    }
    return await firebase.auth().currentUser.linkWithPopup(provider);
};
//# sourceMappingURL=facebook.provider.js.map