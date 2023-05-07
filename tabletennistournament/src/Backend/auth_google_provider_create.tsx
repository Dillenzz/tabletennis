import { getAuth, getRedirectResult, signInWithRedirect, GoogleAuthProvider, UserCredential, OAuthCredential } from "firebase/auth";
import {app} from "./firebaseinit";
import db from "./firebaseinit";
import { ref, set, get } from "firebase/database";


export async function getUsernameAndSessionDuration() {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (user) {
    // Get the username
    const username = user.displayName || user.email || "Unknown";
  
    const uid = user.uid;
    return { username, uid };
  }
  return null;
}

export default async function login(): Promise<UserCredential | null>{  

    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);

    return getRedirectResult(auth)
    .then((result: UserCredential | null) => {
      if (result) {
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential: OAuthCredential | null = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        console.log(token, "token");

        // The signed-in user info.
        const user = result.user;

        const uid = user.uid;

        console.log(user, "user");

        return result;
      }

      return null;
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = (error.customData as any).email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...

      return null;
    });
}

 