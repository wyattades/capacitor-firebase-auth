import firebase from 'firebase/app';
import 'firebase/auth';
import { GoogleSignInResult } from '../definitions';
export const googleSignInWeb = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().useDeviceLanguage();
    const userCredential = await firebase.auth().signInWithPopup(provider);
    const credential = userCredential === null || userCredential === void 0 ? void 0 : userCredential.credential;
    return new GoogleSignInResult(credential.idToken);
};
export const googleLinkWeb = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().useDeviceLanguage();
    if (!firebase.auth().currentUser) {
        throw new Error('No user to link to');
    }
    return await firebase.auth().currentUser.linkWithPopup(provider);
};
//# sourceMappingURL=google.provider.js.map