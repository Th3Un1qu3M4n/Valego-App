import React, { useState, useEffect, useRef } from "react";
import { useFonts } from "expo-font";
import { MyContext } from "./context/tokenContext";
import { StatusBar } from "expo-status-bar";
import { Alert, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import UserTabNavigation from "./src/global component/navigation/user/UserTabNavigation";
import UserAuthNavigation from "./src/global component/navigation/user/UserAuthNavigation";
import AdminHomeNavigation from "./src/global component/navigation/admin/AdminHomeNavigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./config/firebaseConfig";
import axios from "axios";
import WorkerTabNavigation from "./src/global component/navigation/worker/WorkerTabNavigation";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StripeProvider } from "@stripe/stripe-react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });

    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
export default function App() {
  const [token, setToken] = useState("");
  const [userLoggedInType, setUserLoggedInType] = useState("none");
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isUserReg, setIsUserReg] = useState(false);
  // const [requestId, setRequestId] = useState(null);
  // Customer
  const [request, setRequest] = useState(null);
  const [activeRequests, setActiveRequests] = useState([]);

  const API_URL = "http://18.205.125.110:3000";
  // Notification
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);

  const notificationListener = useRef();
  const responseListener = useRef();
  // End notification

  useEffect(() => {
    if (!request) {
      // setRequest(null);
      AsyncStorage.removeItem("Valego_request");
      return;
    } else {
      AsyncStorage.setItem("Valego_request", JSON.stringify(request));
    }
  }, [request]);

  const getActiveRequests = (userToken) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    };
    axios
      .get(`${API_URL}/api/worker/activeRequests`, { headers })
      .then((res) => {
        console.log("got active requests ", res?.data?.length);
        setActiveRequests(res.data);
      })
      .catch((err) => console.log(err));
  };

  const serviceRequested = async (_id) => {
    const auth = getAuth();
    const token = await auth.currentUser.getIdToken(true);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    axios
      .get(`${API_URL}/api/customer/request/${_id}`, { headers })
      .then((res) => {
        // setRequest(res.data);
        // console.log(res.data);
        const vehicle = res.data.vehicleId;
        Alert.alert(
          "Parking Request",
          `${vehicle.vehicleName} - ${vehicle.plates}`,
          [
            {
              text: "OK",
              onPress: () => {
                getActiveRequests(token);
              },
            },
          ]
        );
      })
      .catch((err) => console.log(err));
  };

  const updateRequest = (userToken, _id) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    };
    axios
      .get(`${API_URL}/api/customer/request/${_id}`, { headers })
      .then((res) => {
        setRequest(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    // setRequest(null);
    // AsyncStorage.removeItem("Valego_request");
    const auth = getAuth();
    AsyncStorage.getItem("Valego_request").then((value) => {
      // alert("out value");

      if (value) {
        // alert("in value");
        try {
          const value0 = JSON.parse(value);

          const token = auth.currentUser.getIdToken(true);
          const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          };
          // setRequest(value0);
          axios
            .get(`${API_URL}/api/customer/request/${value0._id}`, {
              headers,
            })
            .then((res) => {
              setRequest(res.data);
            })
            .catch((err) => console.log(err));
        } catch (err) {
          console.log(err);
        }
      }
    });
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          // GET API call to get user data send access token
          const PushToken = await registerForPushNotificationsAsync();
          setExpoPushToken(PushToken);
          notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
              setNotification(notification);
              console.log(notification);
              // // serviceRequested
              // if(notification.request.content.data.type === "vehicleReady"){
              //   getActiveRequests(user.accessToken);
              // }
              // customerRequested
              if (notification.request.content.data.type === "vehicleReady") {
                updateRequest(
                  user.accessToken,
                  notification.request.content.data.requestId
                );
              }
              if (
                notification.request.content.data.type === "serviceDelivered"
              ) {
                Alert.alert(
                  "Thank you for using Valego",
                  "Looking forward to serve you again",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        setRequest(null);
                        AsyncStorage.removeItem("Valego_request");
                      },
                    },
                  ]
                );
                // Thank you for using valego
              } else if (
                notification.request.content.data.type === "serviceRequested"
              ) {
                serviceRequested(notification.request.content.data.requestId);
              } else if (
                notification.request.content.data.type === "customerRequested"
              ) {
                updateRequest(
                  user.accessToken,
                  notification.request.content.data.requestId
                );
                console.log(request);
              }
            });
          responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
              (response) => {
                // console.log(response);
              }
            );
          console.log(user.accessToken);
          const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          };
          setToken(user.accessToken);
          axios
            .post(
              `${API_URL}/api/auth/pushtoken`,
              { pushToken: PushToken.data },
              { headers }
            )
            .then((res) => {
              const userData = res.data._doc;
              console.log("userData", userData);
              console.log("userData.userType", userData.userType);
              if (userData.userType === "Customer") {
                console.log("userData.name", userData.name == "");
                if (userData.name == "") {
                  console.log("Should Show Profile Screen");
                  setIsUserReg(false);
                } else {
                  console.log("Should Not Show Profile Screen");
                  setIsUserReg(true);
                }
              }
              setUserLoggedInType(userData.userType);
              setUser({
                uid: userData.uid,
                id: userData._id,
                Phone: userData?.phone,
                name: userData?.name,
                email: userData?.email,
                companyid: userData?.companyid,
                pushtoken: expoPushToken?.data,
                vehicle: userData?.vehicle,
              });
            })
            .catch((err) => console.log(err));
          AsyncStorage.getItem("Valego_request").then((value) => {
            if (value) {
              const value0 = JSON.parse(value);
              // setRequest(value0);
              axios
                .get(`${API_URL}/api/customer/request/${value0._id}`, {
                  headers,
                })
                .then((res) => {
                  setRequest(res.data);
                })
                .catch((err) => console.log(err));
            }
          });
        } else {
          // User is signed out
          setUser(undefined);
          setUserData(undefined);
          setUserLoggedInType(undefined);
        }
      }
    );
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
      unsubscribeFromAuthStatuChanged;
    };
  }, []);

  // update user state when auth signout
  useEffect(() => {
    console.log("user changed", user);
    if (user === undefined) {
      setUser(undefined);
    }
  }, [user]);

  const [fontsLoaded] = useFonts({
    EncodeSansBold: require("./assets/fonts/Poppins-Bold.ttf"),
    EncodeSansBoldItalic: require("./assets/fonts/Poppins-BoldItalic.ttf"),
    EncodeSansSemiBold: require("./assets/fonts/Poppins-SemiBold.ttf"),
    EncodeSansSemiBoldItalic: require("./assets/fonts/Poppins-SemiBoldItalic.ttf"),
    EncodeSansMedium: require("./assets/fonts/Poppins-Medium.ttf"),
    EncodeSansMediumItalic: require("./assets/fonts/Poppins-MediumItalic.ttf"),
    EncodeSansRegular: require("./assets/fonts/Poppins-Regular.ttf"),
    EncodeSansRegularItalic: require("./assets/fonts/Poppins-Italic.ttf"),
    EncodeSansLight: require("./assets/fonts/Poppins-Light.ttf"),
  });
  if (!fontsLoaded) return null;

  return (
    <StripeProvider publishableKey="pk_test_51M86IQLwOcfWtrog3tyMZ2rLAQUg7hIR4matI9pkidMalkjgXU67MPFTMYwLm75CjUsJReZaSpgrAtR9nhp2bqm600CxZHbzaM">
      <StatusBar style="dark" />
      <MyContext.Provider
        value={{
          user,
          setUser,
          token,
          setToken,
          API_URL,
          isUserReg,
          setIsUserReg,
          setRequest,
          request,
          getActiveRequests,
          activeRequests,
          updateRequest,
        }}
      >
        <NavigationContainer>
          {user && userLoggedInType == "Customer" ? (
            <UserTabNavigation />
          ) : user && userLoggedInType == "Worker" ? (
            <WorkerTabNavigation />
          ) : user && userLoggedInType == "Admin" ? (
            <AdminHomeNavigation />
          ) : (
            <UserAuthNavigation />
          )}
        </NavigationContainer>
      </MyContext.Provider>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
