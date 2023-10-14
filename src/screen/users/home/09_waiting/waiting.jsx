import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Link } from "@react-navigation/native";
import Header from "../../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../../global/globalStyles";
import { MyContext } from "../../../../../context/tokenContext";
import axios from "axios";
import { getAuth } from "firebase/auth";
import Modal from "react-native-modal";
import { BarCodeScanner } from "expo-barcode-scanner";

function User_waiting({ navigation }) {
  const { API_URL, request, setRequest, token } = useContext(MyContext);
  const [QRCode, setQRCode] = useState(false);
  const [showQRModel, setShowQRModel] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  const handleDialPress = () => {
    const phoneNumberToDial = `tel:${request.workerId.phone}`;
    Linking.openURL(phoneNumberToDial);
  };
  const showQR = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `${API_URL}/api/customer/generate/${request.requestId}`,
        {
          headers,
        }
      );
      console.log(response.data.qrCodeUrl);
      setQRCode(response.data.qrCodeUrl);
      setShowQRModel(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const onBtnClick = () => {
    navigation.navigate("user_waiting", {});
  };
  return (
    <SafeAreaView style={[globalStyles.view_screen, { height: "100%" }]}>
      <Header />
      <Modal isVisible={showQRModel}>
        <TouchableWithoutFeedback onPress={() => setShowQRModel(false)}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              style={{ width: 300, height: 300 }}
              source={{
                uri:
                  QRCode ||
                  "https://us.123rf.com/450wm/vectorina24/vectorina242112/vectorina24211200101/179624322-entry-without-a-qr-code-is-prohibited-a-barcode-in-a-crossed-out-red-circle-a-sign-of-prohibition.jpg",
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <View>
        <Text style={globalStyles.text_label_heading}>
          Vehicle waiting to be picked...{" "}
        </Text>
        <Text style={globalStyles.text_label_input}>
          Please receive the vehicle in time
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
              {request.workerId.companyId?.name}
            </Text>
            <Text style={globalStyles.text_label_card}>
              Vehicle: {request.vehicleId.vehicleName}{" "}
            </Text>
            <Text style={globalStyles.text_label_card}>
              Admission time:{" "}
              {new Date(request.checkInTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={showQR}>
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
              Generate QR Code
            </Text>
          </View>
        </TouchableOpacity>
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
              Contact Valet Worker
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* <View style={{ position: "absolute", bottom: 10, left: 20 }}>
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
    resizeMode: "contain",
  },
});

export default User_waiting;
