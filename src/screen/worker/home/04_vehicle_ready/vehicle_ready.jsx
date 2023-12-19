import React, { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  Alert,
  Linking,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Link } from "@react-navigation/native";
import Header from "../../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../../global/globalStyles";
import { MyContext } from "../../../../../context/tokenContext";
import Modal from "react-native-modal";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
import { getAuth } from "firebase/auth";

import axios from "axios";

function Worker_vehicle_ready({ navigation }) {
  const { request, setRequest, API_URL, updateRequest } = useContext(MyContext);
  const [showQRModel, setShowQRModel] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const auth = getAuth();

  const [refreshing, setRefreshing] = React.useState(false);

  const getActiveRequestsData = async () => {
    try {
      const token = await auth.currentUser.getIdToken(true);
      console.log("Updating the request", request._id);
      updateRequest(token, request._id);
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getActiveRequestsData();
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const onBtnClick = () => {
    // navigation.navigate("user_waiting", {});
  };
  const handleDialPress = () => {
    // const phoneNumberToDial = `tel:${request.userId.phone}`;
    // Linking.openURL(phoneNumberToDial);
    navigation.push("chat", {});
  };
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const afterQrScan = () => {
    // setRequest(null);
    AsyncStorage.removeItem("Valego_request");
  };
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setShowQRModel(false);
    const data0 = JSON.parse(data);
    // console.log("completing request with id", data0.requestId);
    // return;
    try {
      const token = await auth.currentUser.getIdToken(true);

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      console.log("completing request with id", data0.requestId);
      if (data0.requestId !== request.requestId) {
        Alert.alert(
          "Wrong QR Code",
          "Please scan the correct QR Code",
          [
            {
              text: "Cancel",
              onPress: () => {
                setScanned(false);
              },
              style: "cancel",
            },
            { text: "OK", onPress: () => setScanned(false) },
          ],
          { cancelable: false }
        );
        return;
      }

      axios
        .post(
          `${API_URL}/api/worker/confirm/${data0.requestId}`,
          { requestId: data0.requestId },
          {
            headers,
          }
        )
        .then((res) => {
          setRequest(null);
          setScanned(false);
          AsyncStorage.removeItem("Valego_request");
        })
        .catch((err) => {
          console.log(err.response.data);
          Alert.alert("Error With QR Code", err?.response?.data?.error);
          setScanned(false);
        });
    } catch (e) {
      console.log("Error:", e);
      Alert.alert("Error With QR Code", e?.error);
      setScanned(false);
    }
  };

  const RenderCamera = () => {
    useEffect(() => {
      setScanned(false);
    }, []);

    return (
      <View style={styles.container}>
        {hasPermission === null ? (
          <Text>Requesting for camera permission</Text>
        ) : hasPermission === false ? (
          <Text style={{ color: "#fff" }}>
            Camera permission is not granted
          </Text>
        ) : (
          <View
            style={{
              height: "100%",
              width: Dimensions.get("window").width,
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={{
                height: "100%",
                width: Dimensions.get("window").width,
              }}
            />
          </View>
        )}
      </View>
    );
  };

  // if (hasPermission === null) {
  //   return <View />;
  // }

  // if (hasPermission === false) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.text}>Camera permission not granted</Text>
  //     </View>
  //   );
  // }
  return (
    <SafeAreaView style={[globalStyles.view_screen, { height: "100%" }]}>
      <Header />
      {showQRModel && (
        <Modal isVisible={showQRModel}>
          <TouchableWithoutFeedback
            onPress={() => setShowQRModel(false)}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <View style={{ height: Dimensions.get("window").height - 250 }}> */}
              {<RenderCamera />}
              {/* </View> */}
              {/* <Text style={globalStyles.text_label_input}>
          Keep the camera pointing towards the code for its correct reading
        </Text> */}
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={globalStyles.text_label_heading}>
          Vehicle Ready to be picked up
        </Text>
        <Image
          source={require("../../../../../assets/icons/waiting.png")}
          style={globalStyles.image_screen}
        />
        <View style={globalStyles.card}>
          <View>
            <Image
              source={require("../../../../../assets/icons/uu.png")}
              style={styles.icon}
            />
          </View>
          <View style={globalStyles.card_content}>
            <Text style={globalStyles.text_label_card_heading}>
              {request.workerId.companyId.name}
            </Text>
            <Text style={globalStyles.text_label_card}>
              Check in hour:{" "}
              {new Date(request.checkInTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Text style={globalStyles.text_label_card}>
              Vehicle ready since:{" "}
              {new Date(request.checkInTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            {console.log(request)}
            {!request?.isPaymentMade && (
              <Text style={globalStyles.text_label_card}>
                Amount to Receive:{" "}
                {(request.amount / 100).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </Text>
            )}
          </View>
        </View>

        <View style={globalStyles.br_10}></View>

        <TouchableOpacity onPress={handleDialPress}>
          <View
            style={[
              globalStyles.btn_01,
              {
                flexDirection: "row",
                justifyContent: "flex-start",
                paddingHorizontal: 15,
              },
            ]}
          >
            <Image
              source={require(`../../../../../assets/icons/cuwhite.png`)}
              style={styles.icon}
            />
            <Text style={[globalStyles.text_label_btn01, { marginLeft: 15 }]}>
              Contact Owner
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            console.log("SCANNING");
            if (!request?.isPaymentMade) {
              console.log("ALERT TO COLLECT");
              try {
                const heading = `Collect ${(
                  request.amount / 100
                ).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}`;
                console.log(heading);
                Alert.alert(
                  heading,
                  "Ensure the collected Amount",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    { text: "Confirm", onPress: () => setShowQRModel(true) },
                  ],

                  { cancelable: false }
                );
              } catch {}
            } else {
              setShowQRModel(true);
            }
          }}
        >
          <View
            style={[
              globalStyles.btn_01,
              {
                flexDirection: "row",
                justifyContent: "flex-start",
                paddingHorizontal: 15,
              },
            ]}
          >
            <View style={{ backgroundColor: "#fff", padding: 1 }}>
              <Image
                source={require(`../../../../../assets/icons/qr.png`)}
                style={[styles.icon]}
              />
            </View>
            <Text style={[globalStyles.text_label_btn01, { marginLeft: 15 }]}>
              SCAN QR
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <View style={{ position: "absolute", bottom: 10, left: 20 }}>
        {/* <TouchableOpacity onPress={() => setRequest(null)}>
          <View
            style={[
              {
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                paddingHorizontal: 15,
                marginVertical: 0,
                width: "100%",
                backgroundColor: "#fff",
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
              },
            ]}
          >
            <Image
              source={require(`../../../../../assets/icons/home.png`)}
              style={styles.icon}
            />
            <Text
              style={[
                globalStyles.text_label_btn01,
                { color: "#1a344f", fontWeight: "700" },
              ]}
            >
              Home
            </Text>
          </View>
        </TouchableOpacity> */}
        {/* <Link
          style={globalStyles.link_01}
          to={{ screen: "contactus", params: {} }}
        >
          Report a Problem
        </Link>
        <Link
          style={globalStyles.link_01}
          to={{ screen: "contactus", params: {} }}
        >
          Contact us
        </Link> */}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  // icon: {
  //   width: 24, // Set the width of your icon
  //   height: 24, // Set the height of your icon
  //   marginRight: 8, // Adjust margin as needed
  //   resizeMode: "contain",
  // },
  icon: {
    width: 24, // Set the width of your icon
    height: 24, // Set the height of your icon
    resizeMode: "contain",
  },
  qrcodeIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 28, // Set the width of your icon
    height: 28, // Set the height of your icon
    marginRight: 8, // Adjust margin as needed
    backgroundColor: "#fff",
    borderRadius: 5,
  },
});

export default Worker_vehicle_ready;
