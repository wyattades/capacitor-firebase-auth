import{a as p,b as c,c as d,d as g,e as h}from"./chunk-AAWQSTYN.js";import n from"firebase/app";import"firebase/auth";import{WebPlugin as A}from"@capacitor/core";import i from"firebase/app";import"firebase/auth";var I=async()=>{let r=new i.auth.OAuthProvider("apple.com");i.auth().useDeviceLanguage();let t=(await i.auth().signInWithPopup(r))?.credential;return new g(t.idToken,"",t.accessToken,t.secret??"")},l=async()=>{let r=new i.auth.FacebookAuthProvider;if(i.auth().useDeviceLanguage(),!i.auth().currentUser)throw new Error("No user to link to");return await i.auth().currentUser.linkWithPopup(r)};import o from"firebase/app";import"firebase/auth";var m=async()=>{let r=new o.auth.FacebookAuthProvider;o.auth().useDeviceLanguage();let t=(await o.auth().signInWithPopup(r))?.credential;return new d(t?.accessToken)},P=async()=>{let r=new o.auth.FacebookAuthProvider;if(o.auth().useDeviceLanguage(),!o.auth().currentUser)throw new Error("No user to link to");return await o.auth().currentUser.linkWithPopup(r)};import a from"firebase/app";import"firebase/auth";var v=async()=>{let r=new a.auth.GoogleAuthProvider;a.auth().useDeviceLanguage();let t=(await a.auth().signInWithPopup(r))?.credential;return new p(t.idToken)},w=async()=>{let r=new a.auth.GoogleAuthProvider;if(a.auth().useDeviceLanguage(),!a.auth().currentUser)throw new Error("No user to link to");return await a.auth().currentUser.linkWithPopup(r)};import u from"firebase/app";import"firebase/auth";var b=async r=>{u.auth().useDeviceLanguage();let e=r.data?.verificationCode,t=new u.auth.RecaptchaVerifier(r.data?.container),W=await(await(await u.auth().signInWithPhoneNumber(r.data?.phone,t)).confirm(e)).user?.getIdToken();return new h(W,e)},f=async()=>Promise.reject("The phone provider was not implemented for web yet");import s from"firebase/app";import"firebase/auth";var S=async()=>{let r=new s.auth.TwitterAuthProvider;s.auth().useDeviceLanguage();let t=(await s.auth().signInWithPopup(r))?.credential;return new c(t.accessToken,t.secret)},k=async()=>{let r=new s.auth.TwitterAuthProvider;if(s.auth().useDeviceLanguage(),!s.auth().currentUser)throw new Error("No user to link to");return await s.auth().currentUser.linkWithPopup(r)};var O="apple.com",R=class extends A{constructor(){super()}async signIn(e){switch(e.providerId){case O:return I(e);case n.auth.GoogleAuthProvider.PROVIDER_ID:return v(e);case n.auth.TwitterAuthProvider.PROVIDER_ID:return S(e);case n.auth.FacebookAuthProvider.PROVIDER_ID:return m(e);case n.auth.PhoneAuthProvider.PROVIDER_ID:return b(e)}return Promise.reject(`The '${e.providerId}' provider was not supported`)}async link(e){switch(e.providerId){case O:return l(e);case n.auth.GoogleAuthProvider.PROVIDER_ID:return w(e);case n.auth.TwitterAuthProvider.PROVIDER_ID:return k(e);case n.auth.FacebookAuthProvider.PROVIDER_ID:return P(e);case n.auth.PhoneAuthProvider.PROVIDER_ID:return f(e)}return Promise.reject(`The '${e.providerId}' provider was not supported`)}async signOut(e){return n.auth().signOut()}};export{R as CapacitorFirebaseAuthWeb};
//# sourceMappingURL=web-UDJQP7A6.js.map