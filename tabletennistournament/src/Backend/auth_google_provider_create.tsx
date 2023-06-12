// firebaseauth.ts
import {
  getRedirectResult,
  signInWithRedirect,
  GoogleAuthProvider,
  UserCredential,
} from "firebase/auth";
import { auth } from "./firebaseinit";

export async function getUsernameAndSessionDuration() {
  return new Promise<{ username: string; uid: string } | null>(
    (resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        if (user) {
          const username = user.displayName || user.email || "Unknown";
          const uid = user.uid;
          resolve({ username, uid });
        } else {
          resolve(null);
        }
      });
    }
  );
}

export async function login(): Promise<UserCredential | null> {
  const provider = new GoogleAuthProvider();

  // Set custom parameters to prompt user to select an account
  provider.setCustomParameters({ prompt: "select_account" });

  clearStorage();

  signInWithRedirect(auth, provider);

  return getRedirectResult(auth)
    .then((result: UserCredential | null) => {
      if (result) {
        // This gives you a Google Access Token. You can use it to access Google APIs.
        
      
        //console.log(token, "token");

        // The signed-in user info.
        

        

        return result;
      }

      return null;
    })
    .catch((error) => {
      console.log(error, "error");

      return null;
    });
}

export function signOut() {
  return auth.signOut();
}

function clearStorage() {
  // Clear cookies
  document.cookie =
    "your_cookie_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Clear local storage
  localStorage.removeItem("your_localstorage_key");
}
