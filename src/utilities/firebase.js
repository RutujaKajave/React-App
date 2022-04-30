import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, set } from "firebase/database";
import {
  getAuth,
  GoogleAuthProvider,
  onIdTokenChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyC6o7qWsIcYX5uWTAwquE6w-zns3hdkL9w",
  authDomain: "scheduler-b2cd9.firebaseapp.com",
  projectId: "scheduler-b2cd9",
  storageBucket: "scheduler-b2cd9.appspot.com",
  messagingSenderId: "170217182397",
  appId: "1:170217182397:web:2f4f3f87ef836ab86cd3d4",
  measurementId: "G-V7EXZD2CHQ",
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export const useData = (path, transform) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const dbRef = ref(database, path);
    const devMode =
      !process.env.NODE_ENV || process.env.NODE_ENV === "development";
    if (devMode) console.log(`loading ${path}`);

    return onValue(
      dbRef,
      (snapshot) => {
        const val = snapshot.val();
        if (devMode) console.log(val);
        setData(transform ? transform(val) : val);
        setLoading(false);
        setError(null);
      },
      (error) => {
        setData(null);
        setLoading(false);
        setError(error);
      }
    );
  }, [path, transform]);

  return [data, loading, error];
};

export const setData = (path, value) => set(ref(database, path), value);

export const signInWithGoogle = () => {
  signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

export const firebaseSignOut = () => signOut(getAuth(firebase));

export const useUserState = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    onIdTokenChanged(getAuth(firebase), setUser);
  }, []);

  return [user];
};
