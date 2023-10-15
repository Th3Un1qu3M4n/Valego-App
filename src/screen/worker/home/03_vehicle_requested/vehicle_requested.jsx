import React, { useState, useContext } from "react";
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

function Worker_vehicle_requested({ navigation }) {
  const { API_URL, request, setRequest, updateRequest } = useContext(MyContext);
  const auth = getAuth();

  const handleDialPress = () => {
    const phoneNumberToDial = `tel:${request.userId.phone}`;
    Linking.openURL(phoneNumberToDial);
  };
  const onBtnClick = async () => {
    // navigation.navigate("worker_vehicle_ready", {});
    try {
      const token = await auth.currentUser.getIdToken(true);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        `${API_URL}/api/worker/vehicleReady/${request.requestId}`,
        {},
        {
          headers,
        }
      );
      // console.log(response.data);
      // navigation.navigate("worker_vehicle_ready", {});
      updateRequest(token, request._id);
    } catch (error) {
      console.error("Error:", error.response.data.error);
    }
  };
  return (
    <SafeAreaView style={[globalStyles.view_screen, { height: "100%" }]}>
      <Header />
      <View>
        <Text style={globalStyles.text_label_heading}>
          Vehicle {request.status == "Accepted" ? "Pending" : "requested"} for
          delivery{" "}
        </Text>
        <Image
          source={require("../../../../../assets/icons/inprocess.png")}
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
              Vehicle: {request.vehicleId.vehicleName}{" "}
            </Text>
            <Text style={globalStyles.text_label_card}>
              Check in hour:{" "}
              {new Date(request.checkInTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
            </Text>
            {!request?.isPaymentMade && (
              <Text style={globalStyles.text_label_card}>
                Amount to Receive:{" "}
                {(request.amount / 100).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}{" "}
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={onBtnClick}
          disabled={request.status != "CarRequested"}
        >
          <View
            style={[
              globalStyles.btn_01,
              {
                flexDirection: "row",
                justifyContent: "flex-start",
                paddingHorizontal: 15,
                backgroundColor:
                  request.status != "CarRequested" ? "#ccc" : "#1a344f",
              },
            ]}
          >
            <Image
              source={require(`../../../../../assets/icons/cuwhite.png`)}
              style={styles.icon}
            />
            <Text style={[globalStyles.text_label_btn01, { marginLeft: 15 }]}>
              Vehicle Ready
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
                marginVertical: 0,
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
      </View>
      <View style={{ position: "absolute", bottom: 0, left: 20 }}>
        <TouchableOpacity onPress={() => setRequest(null)}>
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
        </TouchableOpacity>
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
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  img: {
    width: "90%", // Set the width of your icon
    height: 300,
    resizeMode: "stretch",
  },
  card: {
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 20,
  },
  icon: {
    width: 24, // Set the width of your icon
    height: 24, // Set the height of your icon
    marginRight: 8, // Adjust margin as needed
    resizeMode: "contain",
  },
  card_inner: {
    flexDirection: "row",
  },
  mybtn: {
    backgroundColor: "#1a344f",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
  },
});

export default Worker_vehicle_requested;
