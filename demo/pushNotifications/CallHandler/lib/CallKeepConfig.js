import RNCallKeep from "react-native-callkeep";

const options = {
  ios: {
    appName: "RN Push Playground",
  },
  android: {
    alertTitle: "Permissions required",
    alertDescription: "This application needs to access your phone accounts",
    cancelButton: "Cancel",
    okButton: "ok",

    // Required to get audio in background when using Android 11
    foregroundService: {
      channelId: "org.signalwire.rnpushplayground",
      channelName: "Foreground service for push playground",
      notificationTitle: "RN push playground running in background",
    },
  },
};

// this gets ignored for ios, as we did the setup at appdelegate.m
RNCallKeep.setup(options).then((accepted) => {
  console.log(accepted);
});
