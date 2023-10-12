// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyAoTWXLQv2aSILczxiMpnYrj_Xp0qZpcyc",
  authDomain: "valego-app.firebaseapp.com",
  projectId: "valego-app",
  storageBucket: "valego-app.appspot.com",
  messagingSenderId: "59818155620",
  appId: "1:59818155620:web:ff948189051ef56ec74971",
  measurementId: "G-QGKD1H0Q13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
// const analytics = getAnalytics(app);

export default app;