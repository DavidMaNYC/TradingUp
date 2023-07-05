import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: import.meta.env.VITE_APP_API_KEY as string,
  authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_APP_PROJECT_ID as string,
  storageBucket: "tradingup-fea61.appspot.com",
};
const app = initializeApp(config);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
