import React, { useContext, useState } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Link } from "@react-navigation/native";
import Header from "../../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../../global/globalStyles";
import { useStripe } from "@stripe/stripe-react-native";
import { MyContext } from "../../../../../context/tokenContext";
import axios from "axios";
import { getAuth } from "firebase/auth";

function User_vehicle_pick({ navigation }) {
  const onBtnClick = () => {
    navigation.navigate("user_payment", {});
  };

  const { API_URL, request, setRequest } = useContext(MyContext);
  const auth = getAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const onCheckout = async () => {
    // 1. Create a payment intent
    try {
      // setModalVisible(true);
      // Alert.alert("Send Payment Receipts","Kindly email the payment receipt to Cho Luxury Email for amount:\n$"+amount)
      const token = (await auth.currentUser.getIdToken(true)).toString();

      const Authorization = "Bearer " + token;
      const options = {
        headers: { Authorization },
      };
      // console.log("Getting Payment intent", amount)
      console.log("token is ", token.toString());
      const response = await axios.post(API_URL + "/api/payments/intent", {
        requestId: request.requestId,
      });
      if (response.error) {
        Alert.alert("Something went wrong", response.error);
        return;
      }

      // 2. Initialize the Payment sheet
      const clientSecret = response.data.paymentIntent;
      // const clientSecret =
      // "pi_3NydsrLwOcfWtrog1VyA8tS0_secret_wogLn4jFHzVoEOqA9vdBTQHAf";

      const { error: paymentSheetError } = await initPaymentSheet({
        merchantDisplayName: request.workerId.companyId.name,
        paymentIntentClientSecret: clientSecret,
      });
      if (paymentSheetError) {
        Alert.alert("Something went wrong", paymentSheetError.message);
        return;
      }

      // 3. Present the Payment Sheet from Stripe
      const { error: paymentError } = await presentPaymentSheet();
      if (paymentError) {
        Alert.alert(`Error code: ${paymentError.code}`, paymentError.message);
        console.log(paymentError);
        return;
      }
      // onCreateOrder();
      else {
        Alert.alert("Payment Successful");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        console.log(request);

        console.log(request.requestId);
        axios
          .post(
            `${API_URL}/api/customer/requestForCar/${request.requestId}`,
            {},
            {
              headers,
            }
          )
          .then((responce) => {
            // setRequest(res.data);
            // console.log(res.data);

            axios
              .get(`${API_URL}/api/customer/request/${request._id}`, {
                headers,
              })
              .then((res) => {
                setRequest(res.data);
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err.response.data.error));
      }
    } catch (e) {
      console.log(e);
      console.log(e.response.data);

      if (e.response) {
        Alert.alert("Error", e.response.data.message);
      } else {
        Alert.alert("Error", e.message);
      }
    }
  };

  return (
    <SafeAreaView style={[globalStyles.view_screen, { height: "100%" }]}>
      <Header />
      <View>
        <Text style={globalStyles.text_label_heading}>Vehicle: Parked</Text>
        <Text style={globalStyles.text_label_heading}>
          Code: {request.requestId}
        </Text>
        <View style={globalStyles.br_10}></View>
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
              Vehicle: {request.vehicleId.vehicleName}
            </Text>
            <Text style={globalStyles.text_label_card}>
              Check in hour:{" "}
              {new Date(request.checkInTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Text style={globalStyles.text_label_card}>
              Price: ${request.workerId.companyId.totalChargeAmount / 100} MXN{" "}
            </Text>
          </View>
        </View>
        <View style={globalStyles.br_10}></View>

        <TouchableWithoutFeedback onPress={() => onCheckout()}>
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
              source={require(`../../../../../assets/icons/carwhite.png`)}
              style={styles.icon}
            />
            <Text style={[globalStyles.text_label_btn01, { marginLeft: 15 }]}>
              Request a Vehicle
            </Text>
          </View>
        </TouchableWithoutFeedback>
        {/* <View style={globalStyles.br_5}></View> */}

        <TouchableWithoutFeedback>
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
        </TouchableWithoutFeedback>
      </View>
      <View style={{ position: "absolute", bottom: 20, left: 20 }}>
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
  icon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
});
export default User_vehicle_pick;
