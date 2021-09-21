import firebase from 'firebase/app';
import 'firebase/auth';
import { TwitterSignInResult } from '../definitions';
export const twitterSignInWeb = async () => {
    const provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().useDeviceLanguage();
    const userCredential = await firebase.auth().signInWithPopup(provider);
    const credential = userCredential === null || userCredential === void 0 ? void 0 : userCredential.credential;
    return new TwitterSignInResult(credential.accessToken, credential.secret);
};
export const twitterLinkWeb = async () => {
    const provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().useDeviceLanguage();
    if (!firebase.auth().currentUser) {
        throw new Error('No user to link to');
    }
    return await firebase.auth().currentUser.linkWithPopup(provider);
};
//# sourceMappingURL=twitter.provider.js.map