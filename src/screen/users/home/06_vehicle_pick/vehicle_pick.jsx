import React, { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Alert,
  TouchableOpacity,
  Linking,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Link } from "@react-navigation/native";
import Header from "../../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../../global/globalStyles";
import { Token, useStripe } from "@stripe/stripe-react-native";
import { MyContext } from "../../../../../context/tokenContext";
import axios from "axios";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";

import { getAuth } from "firebase/auth";

function User_vehicle_pick({ navigation }) {
  const { API_URL, request, setRequest, updateRequest } = useContext(MyContext);
  const [showCustomerNotesModel, setCustomerNotesModel] = useState(false);
  const [showValetAcceptingNotesModel, setShowValetAcceptingNotesModel] =
    useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const auth = getAuth();
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
    navigation.navigate("user_payment", {});
  };

  const cancelRequest = async (requestId) => {
    console.log("requestId", requestId);
    try {
      const token = await auth.currentUser.getIdToken(true);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        `${API_URL}/api/customer/cancel/${requestId}`,
        {},
        {
          headers,
        }
      );
      console.log(response.data);
      setRequest(null);
      // navigation.navigate("worker_dashboard", {});
    } catch (error) {
      console.log(error?.response?.data?.error || error?.message || error);
      Alert.alert(
        "Error",
        error?.response?.data?.error || error?.message || error
      );
    }
  };

  // const auth = getAuth();
  // const { initPaymentSheet, presentPaymentSheet } = useStripe();

  // const onCheckout = async () => {
  //   // 1. Create a payment intent
  //   try {
  //     // setModalVisible(true);
  //     // Alert.alert("Send Payment Receipts","Kindly email the payment receipt to Cho Luxury Email for amount:\n$"+amount)
  //     const token = (await auth.currentUser.getIdToken(true)).toString();

  //     const Authorization = "Bearer " + token;
  //     const options = {
  //       headers: { Authorization },
  //     };
  //     // console.log("Getting Payment intent", amount)
  //     console.log("token is ", token.toString());
  //     const response = await axios.post(API_URL + "/api/payments/intent", {
  //       requestId: request.requestId,
  //     });
  //     if (response.error) {
  //       Alert.alert("Something went wrong", response.error);
  //       return;
  //     }

  //     // 2. Initialize the Payment sheet
  //     const clientSecret = response.data.paymentIntent;
  //     // const clientSecret =
  //     // "pi_3NydsrLwOcfWtrog1VyA8tS0_secret_wogLn4jFHzVoEOqA9vdBTQHAf";

  //     const { error: paymentSheetError } = await initPaymentSheet({
  //       merchantDisplayName: request.workerId.companyId.name,
  //       paymentIntentClientSecret: clientSecret,
  //     });
  //     if (paymentSheetError) {
  //       Alert.alert("Something went wrong", paymentSheetError.message);
  //       return;
  //     }

  //     // 3. Present the Payment Sheet from Stripe
  //     const { error: paymentError } = await presentPaymentSheet();
  //     if (paymentError) {
  //       Alert.alert(`Error code: ${paymentError.code}`, paymentError.message);
  //       console.log(paymentError);
  //       return;
  //     }
  //     // onCreateOrder();
  //     else {
  //       Alert.alert("Payment Successful");
  //       const headers = {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       };
  //       console.log(request);

  //       console.log(request.requestId);
  //       axios
  //         .post(
  //           `${API_URL}/api/customer/requestForCar/${request.requestId}`,
  //           {},
  //           {
  //             headers,
  //           }
  //         )
  //         .then((responce) => {
  //           // setRequest(res.data);
  //           // console.log(res.data);

  //           axios
  //             .get(`${API_URL}/api/customer/request/${request._id}`, {
  //               headers,
  //             })
  //             .then((res) => {
  //               setRequest(res.data);
  //             })
  //             .catch((err) => console.log(err));
  //         })
  //         .catch((err) => console.log(err.response.data.error));
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     console.log(e.response.data);

  //     if (e.response) {
  //       Alert.alert("Error", e.response.data.message);
  //     } else {
  //       Alert.alert("Error", e.message);
  //     }
  //   }
  // };
  const navigateToPayment = () => {
    navigation.navigate("user_payment", {});
  };
  const handleDialPress = () => {
    // const phoneNumberToDial = `tel:${request.workerId.phone}`;
    // Linking.openURL(phoneNumberToDial);
    navigation.push("chat", {});
  };
  return (
    <SafeAreaView
      style={[
        // globalStyles.view_screen,
        { height: "100%" },
      ]}
    >
      <Header />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          // height: "100%",
          // backgroundColor: "red",
          // marginBottom: 755,
          // width: "100%",
          padding: 20,
        }}
      >
        <CustomerNotes
          showCustomerNotesModel={showCustomerNotesModel}
          close={() => setCustomerNotesModel(false)}
        />
        <ValetAcceptingNotes
          showValetAcceptingNotesModel={showValetAcceptingNotesModel}
          close={() => setShowValetAcceptingNotesModel(false)}
        />
        <Text style={globalStyles.text_label_heading}>Vehicle: Parked</Text>
        <Text style={globalStyles.text_label_heading}>
          Code: {request?.requestId}
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
              {request?.workerId?.companyId?.name}
            </Text>
            <Text style={globalStyles.text_label_card}>
              Vehicle: {request?.vehicleId?.vehicleName}
            </Text>
            <Text style={globalStyles.text_label_card}>
              Check in hour:{" "}
              {new Date(request?.checkInTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Text style={globalStyles.text_label_card}>
              Price: ${request?.amount ? request?.amount / 100 : ""} MXN{" "}
            </Text>
          </View>
        </View>
        <View style={globalStyles.br_10}></View>

        <TouchableWithoutFeedback onPress={() => navigateToPayment()}>
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
              Request the Vehicle
            </Text>
          </View>
        </TouchableWithoutFeedback>
        {/* <View style={globalStyles.br_5}></View> */}

        <TouchableWithoutFeedback onPress={handleDialPress}>
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
        <View style={styles.row}>
          <TouchableWithoutFeedback
            style={styles.col1}
            onPress={() => setCustomerNotesModel(true)}
          >
            <View
              style={[
                globalStyles.btn_01,
                {
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  paddingHorizontal: 15,
                  flex: 0.49,
                },
              ]}
            >
              <Text style={[globalStyles.text_label_btn01, { marginLeft: 15 }]}>
                My Notes
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => setShowValetAcceptingNotesModel(true)}
            style={styles.col1}
          >
            <View
              style={[
                globalStyles.btn_01,
                {
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  paddingHorizontal: 15,
                  flex: 0.49,
                },
              ]}
            >
              <Text style={[globalStyles.text_label_btn01, { marginLeft: 15 }]}>
                Valet Notes
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <TouchableOpacity onPress={() => cancelRequest(request.requestId)}>
          <View
            style={[
              globalStyles.btn_01,
              {
                flexDirection: "row",
                justifyContent: "center",
                paddingHorizontal: 15,
                marginVertical: 10,
              },
            ]}
          >
            <Text style={[globalStyles.text_label_btn01, {}]}>
              Cancel Request
            </Text>
          </View>
        </TouchableOpacity>
        <View style={{}}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

function CustomerNotes(props) {
  const { token, API_URL, request, updateRequest } = useContext(MyContext);

  // const [vehicle, setVehicle] = useState("");
  // const [vehicleError, setVehicleError] = useState(false);

  const [body, setBody] = useState(request?.customerNotes?.text);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageOnline, setSelectedImageOnline] = useState(null);

  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
      setSelectedImage(result.assets[0].uri);
      setShowImage(true);
    } else {
      alert("You did not select any image.");
    }
  };

  useEffect(() => {
    if (props.showCustomerNotesModel) {
      setBody(request?.customerNotes?.text);
      setSelectedImageOnline(request?.customerNotes?.image);
    }
  }, [props.showCustomerNotesModel]);
  const addMyNotes = async () => {
    let to_process = true;

    if (to_process) {
      try {
        const formData = new FormData();
        if (selectedImage) {
          const uri = selectedImage;
          const uriParts = uri.split(".");
          const fileType = uriParts[uriParts.length - 1];
          formData.append("image", {
            uri,
            name: Date.now() + `.${fileType}`,
            type: `image/${fileType}`,
          });
        } else {
          const uri = API_URL + "/" + selectedImageOnline;
          const uriParts = uri.split(".");
          const fileType = uriParts[uriParts.length - 1];
          formData.append("image", {
            uri,
            name: Date.now() + `.${fileType}`,
            type: `image/${fileType}`,
          });
        }

        formData.append("text", body);

        const headers = {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.post(
          `${API_URL}/api/customer/updateRequestComments/${request._id}`,
          formData,
          { headers }
        );
        console.log("response", response.data);
        updateRequest(token, request._id);
        setBody("");
        setSelectedImage(null);
        setSelectedImageOnline(null);
        setShowImage(false);
        alert("Notes Updated!");
        props.close();
      } catch (error) {
        console.error("Error :", error.response);
        console.error("Error :", error);
      }
    }
  };
  return (
    <View>
      <Modal isVisible={props.showCustomerNotesModel}>
        <TouchableWithoutFeedback>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                width: "95%",
                paddingHorizontal: 15,
                paddingVertical: 15,
                borderRadius: 10,
              }}
            >
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={globalStyles.text_label_heading}>
                  Customer Notes
                </Text>
              </View>
              <View style={globalStyles.br_10}></View>
              <TouchableOpacity onPress={pickImageAsync}>
                <View style={[globalStyles.text_input, styles.row]}>
                  <TextInput
                    style={globalStyles.text_label_input_text}
                    value="Select Img"
                    editable={false}
                    selectTextOnFocus={false}
                  />

                  <Image
                    source={require("../../../../../assets/icons/a.png")} // Replace with your actual icon path
                    style={styles.icon}
                  />
                </View>
              </TouchableOpacity>

              {showImage && (
                <Image
                  source={{ uri: selectedImage }}
                  style={{ width: 100, height: 100, resizeMode: "contain" }}
                />
              )}
              {!showImage && selectedImageOnline && (
                <Image
                  source={{ uri: `${API_URL}/${selectedImageOnline}` }}
                  style={{ width: 100, height: 100, resizeMode: "contain" }}
                />
              )}
              <Text style={globalStyles.text_label_input}>Body</Text>
              <TextInput
                style={[
                  globalStyles.text_input,
                  { height: 100, textAlignVertical: "top" },
                ]}
                value={body}
                onChangeText={(e) => setBody(e)}
                placeholder={"My Notes"}
                multiline={true}
                numberOfLines={4}
              />

              <View style={globalStyles.br_10}></View>

              <TouchableOpacity
                style={globalStyles.btn_01}
                onPress={addMyNotes}
              >
                <Text style={globalStyles.text_label_btn01}>Update</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[globalStyles.btn_01, { backgroundColor: "#FF5733" }]}
                onPress={props.close}
              >
                <Text style={globalStyles.text_label_btn01}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

function ValetAcceptingNotes(props) {
  const { token, API_URL, request } = useContext(MyContext);

  // const [vehicle, setVehicle] = useState("");
  // const [vehicleError, setVehicleError] = useState(false);
  const [body, setBody] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    setBody(request?.workerNotes?.text);
    setSelectedImage(request?.workerNotes?.image);
  }, [request]);
  return (
    <View>
      <Modal isVisible={props.showValetAcceptingNotesModel}>
        <TouchableWithoutFeedback>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                width: "95%",
                paddingHorizontal: 15,
                paddingVertical: 15,
                borderRadius: 10,
              }}
            >
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={globalStyles.text_label_heading}>
                  Valet Accepting Notes
                </Text>
              </View>
              <View style={globalStyles.br_10}></View>
              {/* <TouchableOpacity onPress={pickImageAsync}>
                <View style={[globalStyles.text_input, styles.row]}>
                  <TextInput
                    style={globalStyles.text_label_input_text}
                    value="Select Img"
                    editable={false}
                    selectTextOnFocus={false}
                  /> */}
              {/* <Image
                    source={require("../../../../../assets/icons/a.png")} // Replace with your actual icon path
                    style={styles.icon}
                  /> */}
              {/* </View>
              </TouchableOpacity> */}

              {selectedImage && (
                <Image
                  source={{ uri: `${API_URL}/${selectedImage}` }}
                  style={{ width: 150, height: 150, resizeMode: "contain" }}
                />
              )}
              <Text style={globalStyles.text_label_input}>Body</Text>
              <TextInput
                style={[
                  globalStyles.text_input,
                  { height: 100, textAlignVertical: "top" },
                ]}
                value={body}
                editable={false}
                selectTextOnFocus={false}
                multiline={true}
                numberOfLines={4}
              />

              <View style={globalStyles.br_10}></View>

              {/* <TouchableOpacity
                style={globalStyles.btn_01}
                onPress={addMyNotes}
              >
                <Text style={globalStyles.text_label_btn01}>Update</Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                style={[globalStyles.btn_01, { backgroundColor: "#FF5733" }]}
                onPress={props.close}
              >
                <Text style={globalStyles.text_label_btn01}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  col1: {
    flex: 0.49,
    height: "100%",
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
});
export default User_vehicle_pick;
