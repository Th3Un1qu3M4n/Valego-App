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
  Dimensions
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
  const { request, setRequest, API_URL } = useContext(MyContext);
  const [showQRModel, setShowQRModel] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const auth = getAuth();
  const onBtnClick = () => {
    // navigation.navigate("user_waiting", {});
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
    const data0 = JSON.parse(data);
    
    try {
      const token = await auth.currentUser.getIdToken(true);

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      
      axios
        .post(`${API_URL}/api/worker/confirm/${request.requestId}`,{"requestId": request.requestId}, {
          headers,
        })
        .then((res) => {
          setRequest(null);
          AsyncStorage.removeItem("Valego_request");

        })
        .catch((err) => console.log(err.response.data));
    } catch (e) {
      console.log("Error:", e);
    }

  };

  const renderCamera = () => {
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
      <Modal isVisible={showQRModel}>
        <TouchableWithoutFeedback onPress={() => setShowQRModel(false)}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View style={{ height: Dimensions.get("window").height - 250 }}>
              {renderCamera()}
            </View>
            {/* <Text style={globalStyles.text_label_input}>
          Keep the camera pointing towards the code for its correct reading
        </Text> */}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <View>
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
          </View>
        </View>

        <View style={globalStyles.br_10}></View>

        <TouchableOpacity onPress={onBtnClick}>
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
        <TouchableOpacity onPress={() => setShowQRModel(true)}>
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
            <View style={[styles.qrcodeIcon]}>
              <Image source={require("../../../../../assets/icons/qr.png")} />
            </View>
            <Text style={[globalStyles.text_label_btn01, { marginLeft: 15 }]}>
              SCAN QR
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* <View style={{ position: "absolute", bottom: 10, left: 20 }}>
        <Link
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
        </Link>
      </View> */}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  icon: {
    width: 24, // Set the width of your icon
    height: 24, // Set the height of your icon
    marginRight: 8, // Adjust margin as needed
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
