import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, type User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { OWNER_EMAIL } from "./analytics-model";
import publicConfig from "@/data/firebase-public-config.json";

const config = { apiKey: import.meta.env.VITE_FIREBASE_API_KEY || publicConfig.apiKey, authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || publicConfig.authDomain, projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || publicConfig.projectId, appId: import.meta.env.VITE_FIREBASE_APP_ID || publicConfig.appId };
export const firebaseConfigured = Object.values(config).every(value => typeof value === "string" && value.length > 0);
const app = firebaseConfigured ? getApps()[0] ?? initializeApp(config) : null;
const appCheckKey = import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY || publicConfig.appCheckSiteKey;
if (app && appCheckKey && !["localhost", "127.0.0.1"].includes(location.hostname)) {
  initializeAppCheck(app, { provider: new ReCaptchaEnterpriseProvider(appCheckKey), isTokenAutoRefreshEnabled: true });
}
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export async function isOwner(user: User | null) {
  if (!user || user.isAnonymous || !user.emailVerified || user.email !== OWNER_EMAIL) return false;
  const result = await user.getIdTokenResult();
  return result.signInProvider === "google.com";
}
export async function ownerSignIn() {
  if (!auth) throw new Error("Admin sign-in is not connected yet.");
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account", login_hint: OWNER_EMAIL });
  const result = await signInWithPopup(auth, provider);
  if (!await isOwner(result.user)) { await signOut(auth); throw new Error("This dashboard is only available to its owner. Please use the authorized Google account."); }
  try { localStorage.setItem("portfolio-analytics-exclude", "true"); } catch {}
}
