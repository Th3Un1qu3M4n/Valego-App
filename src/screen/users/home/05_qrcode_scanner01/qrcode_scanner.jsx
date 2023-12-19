import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Link } from "@react-navigation/native";
import Header from "../../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../../global/globalStyles";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
import { MyContext } from "../../../../../context/tokenContext";
import axios from "axios";

function User_qrcode_scanner({ navigation }) {
  const [scanned, setScanned] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const { API_URL, setRequest } = useContext(MyContext);
  const auth = getAuth();

  const getCurrentRequest = async () => {
    try {
      const token = await auth.currentUser.getIdToken(true);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      axios
        .get(`${API_URL}/api/worker/activeRequests`, { headers })
        .then((res) => {
          console.log("got active requests ", res?.data?.length);
          console.log(res.data[0]);
          setRequest(res.data[0]);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  useEffect(() => {
    getCurrentRequest();
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    setScanned(false);
  }, []);

  const RenderCamera = () => {
    // useEffect(() => {
    //   const unsubscribe = navigation.addListener("focus", () => {
    //     setScanned(false);
    //   });

    //   return unsubscribe;
    // }, [navigation]);

    const handleBarCodeScanned = async ({ type, data }) => {
      setScanned(true);

      // console.log("In Handle scanned", data);
      // return;

      try {
        const token = await auth.currentUser.getIdToken(true);
        console.log(data);
        data = JSON.parse(data);

        // if (data.request.requestId) {
        //   setScanned(true);
        // }
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.post(
          `${API_URL}/api/customer/accept/${data.request.requestId}`,
          {},
          { headers }
        );
        // setRequest(response.data.request);
        axios
          .get(`${API_URL}/api/customer/request/${response.data.request._id}`, {
            headers,
          })
          .then((res) => {
            setRequest(res.data);
          })
          .catch((err) => {
            setScanned(true);
            console.log(err);
          });
        console.log("API Response:", response.data);
      } catch (e) {
        console.log("error", e);
        // console.log("Error:", e.response.data.error);
        setScanned(false);
      }

      // onBtnClick();
    };

    return (
      <View>
        {hasPermission === null ? (
          <Text>Requesting for camera permission</Text>
        ) : hasPermission === false ? (
          <Text style={{ color: "#fff" }}>
            Camera permission is not granted
          </Text>
        ) : (
          <>
            <TouchableOpacity
              style={[
                globalStyles.btn_01,
                {
                  zIndex: 10,
                },
              ]}
              onPress={() => {
                setScanned((prev) => !prev);
              }}
            >
              <Text style={globalStyles.text_label_btn01}>Toggle Scanner</Text>
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                // height: "100%",
                // width: "100%",
                height: Dimensions.get("window").height - 200,
                width: Dimensions.get("window").width - 50,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                // backgroundColor: "red",
                position: "relative",
              }}
            >
              {!scanned && (
                <BarCodeScanner
                  onBarCodeScanned={(e) => handleBarCodeScanned(e)}
                  style={{
                    position: "absolute",
                    top: 0,
                    margin: 0,
                    zIndex: 0,
                    height: "100%",
                    width: "100%",
                  }}
                />
              )}
            </View>
          </>
        )}
      </View>
    );
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission not granted</Text>
      </View>
    );
  }
  const onBtnClick = () => {
    navigation.navigate("user_vehicle_pick", {});
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <View>
        {/* <Text>HEELo</Text> */}
        <Header style={[{ height: "100%" }]} />
      </View>
      <ScrollView
        contentContainerStyle={{
          // height:
          //   Dimensions.get("window").height -
          //   Dimensions.get("window").width / 100,
          // marginTop: 200,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RenderCamera />
      </ScrollView>
      <View
        style={{
          // height:
          //   Dimensions.get("window").height -
          //   Dimensions.get("window").width / 100,
          marginTop: 200,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex=start",
          position: "absolute",
          gap: 10,
          paddingHorizontal: 10,
          bottom: 0,
        }}
      >
        <Text style={[globalStyles.text_label_input]}>
          Keep the camera pointing towards the code for its correct reading
        </Text>
        <Link
          style={globalStyles.link_01}
          to={{ screen: "contactus", params: {} }}
        >
          Contact us
        </Link>
      </View>
      {/* <View
        style={{
          // height:
          //   Dimensions.get("window").height -
          //   Dimensions.get("window").width / 100,
          marginTop: 200,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          // position: "absolute",
          // bottom: 200,
        }}
      > */}

      {/* </View> */}
      {/* <View style={{ flex: 1, backgroundColor: "red" }}> */}
      {/* <Header style={[{ height: "100%" }]} /> */}

      {/* <TouchableOpacity  style={globalStyles.btn_01} onPress={onBtnClick} >
          <Text style={globalStyles.text_label_btn01}>Cancel</Text>
        </TouchableOpacity> */}

      {/* <View
          style={{
            // height:
            //   Dimensions.get("window").height -
            //   Dimensions.get("window").width / 100,
            marginTop: 200,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            // position: "absolute",
            // bottom: 200,
          }}
        >
          <Text style={[globalStyles.text_label_input]}>
            Keep the camera pointing towards the code for its correct reading
          </Text>
          <Link
            style={globalStyles.link_01}
            to={{ screen: "contactus", params: {} }}
          >
            Contact us
          </Link>
        </View> */}
      {/* </View> */}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    zIndex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
});
export default User_qrcode_scanner;
