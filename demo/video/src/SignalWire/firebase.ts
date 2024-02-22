import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCr8Ed_MiEbhpNo2P1L9_2dgt5lkSDfzzE",
  authDomain: "callfabric-fcm.firebaseapp.com",
  projectId: "callfabric-fcm",
  storageBucket: "callfabric-fcm.appspot.com",
  messagingSenderId: "919418631507",
  appId: "1:919418631507:web:3bc5604cb8f99e5cc45da6",
  measurementId: "G-RNYXY7G94P",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const VAPIDTOKEN =
  "BJZNmozt4UWr3jOo63PhNv36cL_k2VoaZhOy_skCJJ3Xan-jKygubpu-67MDKFBTw9iq0QZtuAwS5Tkt3SdoQas";

const messaging = getMessaging();

export const getToken2 = (onTokenFound: (token: string | null) => void) => {
  return getToken(messaging, { vapidKey: VAPIDTOKEN })
    .then((currentToken) => {
      if (currentToken) {
        console.log("current token for client: ", currentToken);
        onTokenFound(currentToken);
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
        onTokenFound(null);
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
