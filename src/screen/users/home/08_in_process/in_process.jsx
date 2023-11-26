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
  ScrollView,
  RefreshControl,
} from "react-native";
import { Link } from "@react-navigation/native";
import Header from "../../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../../global/globalStyles";
import { MyContext } from "../../../../../context/tokenContext";
import Modal from "react-native-modal";
import { getAuth } from "firebase/auth";

function User_in_process({ navigation }) {
  const { request, updateRequest } = useContext(MyContext);
  const [showViewNotesModel, setShowViewNotesModel] = useState(false);
  const [showViewNotesType, setShowViewNotesType] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const auth = getAuth();

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const getActiveRequestsData = async () => {
    try {
      const token = await auth.currentUser.getIdToken(true);
      updateRequest(token, request._id);
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getActiveRequestsData();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  // console.log(request);
  const handleDialPress = () => {
    // const phoneNumberToDial = `tel:${request.workerId.phone}`;
    // Linking.openURL(phoneNumberToDial);
    navigation.navigate("chat", {});
  };
  const onBtnClick = () => {
    navigation.navigate("user_waiting", {});
  };
  return (
    <SafeAreaView style={[globalStyles.view_screen, { height: "100%" }]}>
      <Header />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ViewNotes
          showViewNotesModel={showViewNotesModel}
          type={showViewNotesType}
          close={() => setShowViewNotesModel(false)}
        />
        <Text style={globalStyles.text_label_heading}>
          Vehicle in process to deliver{" "}
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
            <Text style={globalStyles.text_label_card}>
              Price: ${request.amount / 100} MXN{" "}
            </Text>
          </View>
        </View>

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
        {/*  */}

        <View style={styles.row}>
          <TouchableWithoutFeedback
            style={styles.col1}
            onPress={() => {
              setShowViewNotesType("Customer");
              setShowViewNotesModel(true);
            }}
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
            onPress={() => {
              setShowViewNotesType("Valet");
              setShowViewNotesModel(true);
            }}
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
        {/*  */}
      </ScrollView>
      <View style={{ position: "absolute", bottom: 10, left: 20 }}>
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

function ViewNotes(props) {
  const { token, API_URL, request } = useContext(MyContext);

  // const [vehicle, setVehicle] = useState("");
  // const [vehicleError, setVehicleError] = useState(false);
  const [body, setBody] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    if (props.showViewNotesModel) {
      if (props.type === "Customer") {
        setBody(request.customerNotes.text);
        setSelectedImage(request.customerNotes.image);
      } else {
        setBody(request?.workerNotes?.text);
        setSelectedImage(request?.workerNotes?.image);
      }
    }
  }, [props.showViewNotesModel]);
  return (
    <View>
      <Modal isVisible={props.showViewNotesModel}>
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
                  {props.type == "Customer"
                    ? "Customer Notes"
                    : "Valet Accepting Notes"}
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
    width: 24, // Set the width of your icon
    height: 24, // Set the height of your icon
    marginRight: 8, // Adjust margin as needed
    resizeMode: "contain",
  },
});

export default User_in_process;
