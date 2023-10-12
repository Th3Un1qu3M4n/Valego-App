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
  Alert,
} from "react-native";
import { Link } from "@react-navigation/native";
import Header from "../../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../../global/globalStyles";
import { useStripe } from "@stripe/stripe-react-native";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { MyContext } from "../../../../../context/tokenContext";

function User_payment({ navigation }) {
  const { API_URL, request, setRequest } = useContext(MyContext);
  const [cash, setCash] = useState(false);

  const auth = getAuth();

  const onBtnClick = async () => {
    const token = (await auth.currentUser.getIdToken(true)).toString();
    if (cash) {
      Alert.alert("Payment Successful");
      sendRequestToWorker(token, true);
    } else {
      onCheckout(token);
    }
  };

  const sendRequestToWorker = async (token, cash) => {
    try {
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
          { cash: cash || false },
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
    } catch (e) {
      console.log(e);
      console.log(e.response.data);
      Alert.alert("Error", e.response.data.message);
    }
  };

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const onCheckout = async (token) => {
    // 1. Create a payment intent
    try {
      // setModalVisible(true);
      // Alert.alert("Send Payment Receipts","Kindly email the payment receipt to Cho Luxury Email for amount:\n$"+amount)

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
        sendRequestToWorker();
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
        <Text style={globalStyles.text_label_heading}>
          Total: ${request?.amount ? request?.amount / 100 : ""} MXN{" "}
        </Text>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../../../../assets/icons/card.png")}
            style={[globalStyles.image_screen, { height: 300 }]}
          />
        </View>
        <Text>Please select payment method</Text>
        <View
          style={{
            height: "auto",
            padding: "20px",
            flexDirection: "row",
            backgroundColor: "#1a344f",
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            padding: 3,
          }}
        >
          <TouchableWithoutFeedback onPress={() => setCash(true)}>
            <View
              style={cash ? styles.switch_selected : styles.switch_notselected}
            >
              <Text
                style={{ color: cash ? "#1a344f" : "#fff", fontWeight: "600" }}
              >
                Cash
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => setCash(false)}>
            <View
              style={!cash ? styles.switch_selected : styles.switch_notselected}
            >
              <Text
                style={{ color: !cash ? "#1a344f" : "#fff", fontWeight: "600" }}
              >
                Card
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={globalStyles.br_10}></View>
        <TouchableOpacity style={globalStyles.btn_01} onPress={onBtnClick}>
          <Text style={globalStyles.text_label_btn01}>Pay now</Text>
        </TouchableOpacity>
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
  img: {
    width: "90%", // Set the width of your icon
    height: 250,
    resizeMode: "cover",
  },
  switch_selected: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    fontFamily: "EncodeSansBold",
    fontWeight: "900",
    flex: 0.5,
    overflow: "hidden",
  },
  switch_notselected: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a344f",
    borderRadius: 10,
    fontFamily: "EncodeSansBold",
    fontWeight: "900",
    flex: 0.5,
    overflow: "hidden",
  },
});
export default User_payment;
