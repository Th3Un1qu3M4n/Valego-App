import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { Link } from "@react-navigation/native";
import Header from "../../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../../global/globalStyles";
import Modal from "react-native-modal";
import { MyContext } from "../../../../../context/tokenContext";
import axios from "axios";
import { getAuth } from "firebase/auth";
function Workerdashboard({ navigation }) {
  const { API_URL, getActiveRequests, activeRequests } = useContext(MyContext);
  const [QRCode, setQRCode] = useState(false);
  const [showQRModel, setShowQRModel] = useState(false);
  const [lstOfActiveRequests, setLstOfActiveRequests] = useState([]);
  const auth = getAuth();

  const getActiveRequestsData = async () => {
    try {
      const token = await auth.currentUser.getIdToken(true);
      getActiveRequests(token);
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  useEffect(() => {
    setShowQRModel(false);
  }, [activeRequests]);

  useEffect(() => {
    getActiveRequestsData();
    // const fetchActiveRequestsData = async () => {
    //   try {
    //     const headers = {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     };
    //     const response = await axios.get(`${API_URL}/api/worker/activeRequests`, { headers });
    //    console.log(response.data);
    //     // let temp = [];
    //     // for (const element of response.data) {
    //     //   temp.push({ label: element.name, value: element._id });
    //     // }
    //     // setCompanyItems(temp);
    //   } catch (error) {
    //     console.error("Error fetching company data:", error);
    //   }
    // };

    // fetchActiveRequestsData();
  }, []);

  const showQR = async () => {
    try {
      const token = await auth.currentUser.getIdToken(true);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`${API_URL}/api/worker/generate-qr`, {
        headers,
      });
      // console.log(response.data.qrCodeUrl);
      setQRCode(response.data.qrCodeUrl);
      setShowQRModel(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const onBtnClick = () => {
    navigation.navigate("worker_vehicle_requested", {});
  };
  return (
    <SafeAreaView style={globalStyles.view_screen}>
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
      <ScrollView>
        <View style={[globalStyles.text_input, styles.row]}>
          <Image
            source={require("../../../../../assets/icons/search.png")}
            style={styles.icon}
          />
          <TextInput
            secureTextEntry={false}
            style={[globalStyles.text_label_input_text, { width: "75%" }]}
            placeholder="Search"
          />
          <TouchableWithoutFeedback onPress={showQR}>
            <Image
              source={require("../../../../../assets/icons/qr.png")}
              style={[styles.icon, { position: "absolute", right: 5 }]}
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={globalStyles.br_5}></View>

        <View style={styles.cardContainer}>
          {activeRequests.map((item, index) => {
            return (
              <View style={globalStyles.card_02} key={index}>
                <Image
                  // source={require("../../../../../assets/images/car.png")}
                  source={{ uri: `${API_URL}/${item.vehicleId?.vehicleImage}` }}
                  style={styles.car_img_dashboard}
                />
                <Text style={globalStyles.text_label_card_02_head}>
                  {item.vehicleId?.vehicleName}
                </Text>
                <Text style={globalStyles.text_label_card_02}>
                  {item.vehicleId?.plates}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={globalStyles.br_15}></View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 24, // Set the width of your icon
    height: 24, // Set the height of your icon
    marginRight: 8, // Adjust margin as needed
    resizeMode: "contain",
  },

  car_img_dashboard: {
    resizeMode: "stretch",
    width: "100%",
    height: 100,
  },

  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
export default Workerdashboard;
