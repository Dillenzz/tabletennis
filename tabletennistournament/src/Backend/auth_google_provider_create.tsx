import {
  getAuth,
  getRedirectResult,
  signInWithRedirect,
  GoogleAuthProvider,
  UserCredential,
  OAuthCredential,
} from "firebase/auth";
import { app } from "./firebaseinit";

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

export default async function login(): Promise<UserCredential | null> {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // Set custom parameters to prompt user to select an account
  provider.setCustomParameters({ prompt: "select_account" });

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

        console.log(user, "user");

        return result;
      }

      return null;
    })
    .catch((error) => {
      console.log(error, "error");

      return null;
    });
}
