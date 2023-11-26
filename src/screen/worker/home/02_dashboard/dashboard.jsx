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
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Link } from "@react-navigation/native";
import Header from "../../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../../global/globalStyles";
import Modal from "react-native-modal";
import { MyContext } from "../../../../../context/tokenContext";
import axios from "axios";
import { getAuth } from "firebase/auth";

let ScreenHeight = Dimensions.get("window").height;

function Workerdashboard({ navigation }) {
  const { API_URL, getActiveRequests, setRequest, activeRequests } =
    useContext(MyContext);
  const [QRCode, setQRCode] = useState(false);
  const [showQRModel, setShowQRModel] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [lstOfActiveRequests, setLstOfActiveRequests] = useState([]);
  const auth = getAuth();

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const getActiveRequestsData = async () => {
    try {
      const token = await auth.currentUser.getIdToken(true);
      getActiveRequests(token);
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  const setSelectedRequest = async (requestId) => {
    try {
      const token = await auth.currentUser.getIdToken(true);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      console.log("header", headers);

      axios
        .get(`${API_URL}/api/customer/request/${requestId}`, {
          headers,
        })
        .then((res) => {
          setRequest(res.data);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setShowQRModel(false);
  }, [activeRequests]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getActiveRequestsData();
    setRefreshing(false);
  }, []);

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
      setQrLoading(true);
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
      setQrLoading(false);
      setShowQRModel(true);
    } catch (error) {
      console.error("Error:", error);
      setQrLoading(false);
    }
  };
  const onBtnClick = () => {
    navigation.navigate("worker_vehicle_requested", {});
  };
  return (
    <SafeAreaView style={globalStyles.view_screen}>
      <Header />
      <Modal isVisible={showQRModel}>
        <TouchableOpacity
          onPress={() => setShowQRModel(false)}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          > */}
          <Image
            style={{ width: 300, height: 300 }}
            source={{
              uri:
                QRCode ||
                "https://us.123rf.com/450wm/vectorina24/vectorina242112/vectorina24211200101/179624322-entry-without-a-qr-code-is-prohibited-a-barcode-in-a-crossed-out-red-circle-a-sign-of-prohibition.jpg",
            }}
          />
          {/* </View> */}
        </TouchableOpacity>
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
          {qrLoading ? (
            <View
              style={{
                position: "absolute",
                right: 5,
              }}
            >
              <ActivityIndicator size="large" color="#1a344f" />
            </View>
          ) : (
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 5,
              }}
              onPress={showQR}
            >
              <Image
                source={require("../../../../../assets/icons/qr.png")}
                style={[styles.icon]}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={globalStyles.br_5}></View>

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.cardContainer}
          // style={styles.cardContainer}
        >
          {activeRequests.map((item, index) => {
            return (
              <TouchableOpacity
                style={globalStyles.card_02}
                key={index}
                onPress={() => setSelectedRequest(item._id)}
              >
                {/* Red dot on top right corner */}
                {item.status == "CarRequested" && (
                  <View
                    style={{
                      position: "absolute",
                      zIndex: 1,
                      top: 15,
                      right: 15,
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: "#ff0000",
                    }}
                  ></View>
                )}
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
                <Text style={globalStyles.text_label_card_02}>
                  Status: {item.status == "Accepted" ? "Pending" : item.status}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
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
    flex: 1,
    height: ScreenHeight - 200,
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
export default Workerdashboard;
