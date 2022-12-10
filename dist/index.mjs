var P=Object.defineProperty;var R=(e,t,n)=>t in e?P(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var I=(e,t,n)=>(R(e,typeof t!="symbol"?t+"":t,n),n);import r from"firebase/app";import"firebase/auth";import{registerPlugin as h}from"@capacitor/core";var w=h("CapacitorFirebaseAuth",{web:async()=>({signIn:async()=>{throw new Error("web not implemented")},link:async()=>{throw new Error("web not implemented")},signOut:async()=>{throw new Error("web not implemented")}})}),c=w;var p=class extends r.auth.OAuthProvider{constructor(){super(p.PROVIDER_ID)}},u=p;I(u,"PROVIDER_ID","apple.com");var s=(e,t)=>({providerId:e.PROVIDER_ID,Provider:e,buildCredential:t}),g={["google.com"]:s(r.auth.GoogleAuthProvider,({idToken:e},t)=>t.credential(e)),["apple.com"]:s(u,({idToken:e,rawNonce:t},n)=>{let i=new n;return i.addScope("email"),i.addScope("name"),i.credential({idToken:e,rawNonce:t})}),["facebook.com"]:s(r.auth.FacebookAuthProvider,({idToken:e},t)=>t.credential(e)),["twitter.com"]:s(r.auth.TwitterAuthProvider,({idToken:e,secret:t},n)=>n.credential(e,t)),phone:s(r.auth.PhoneAuthProvider,({verificationId:e,verificationCode:t},n)=>t?n.credential(e,t):null)},O=async(e,...[t])=>{let n=g[e];if(!n)throw new Error(`Provider ${e} not found`);let{Provider:i,buildCredential:l}=n,o=await c.signIn({providerId:e,data:t}),a=await l(o,i);return a?{userCredential:await r.app().auth().signInWithCredential(a),result:o}:null},v=async(e,...[t])=>{let n=g[e];if(!n)throw new Error(`Provider ${e} not found`);let{Provider:i,buildCredential:l}=n,o=await c.link({providerId:e,data:t}),a=await l(o,i);if(!a)return null;let d=r.app().auth().currentUser;if(!d)throw new Error("No user to link to");return{userCredential:await d.linkWithCredential(a),result:o}},C=async()=>{await c.signOut({}),await r.app().auth().signOut()};export{w as CapacitorFirebaseAuth,v as link,O as signIn,C as signOut};
//# sourceMappingURL=index.mjs.map