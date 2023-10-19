import React, { useState, useContext , useEffect} from "react";
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
} from "react-native";
import { Link } from "@react-navigation/native";
import Header from "../../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../../global/globalStyles";
import { MyContext } from "../../../../../context/tokenContext";
import axios from "axios";
import { getAuth } from "firebase/auth";
import Modal from "react-native-modal";

function Worker_vehicle_requested({ navigation }) {
  const { API_URL, request, setRequest, updateRequest } = useContext(MyContext);
  const auth = getAuth();
  const [showViewNotesModel, setShowViewNotesModel] = useState(false);
  const [showValetNotesModel, setShowValetNotesModel] = useState(false);
  const [showViewNotesType, setShowViewNotesType] = useState(false);

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
      <ScrollView style={{ height: "100%" }}>
        <ViewNotes
          showViewNotesModel={showViewNotesModel}
          type={showViewNotesType}
          close={() => setShowViewNotesModel(false)}
        />
        <ValetNotes
          showValetNotesModel={showValetNotesModel}
          close={() => setShowValetNotesModel(false)}
        />
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

          {request.status == "CarRequested" && (
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
                <Text
                  style={[globalStyles.text_label_btn01, { marginLeft: 15 }]}
                >
                  Vehicle Ready
                </Text>
              </View>
            </TouchableOpacity>
          )}
          <View style={globalStyles.br_5}></View>
          <TouchableOpacity  onPress={() => setShowValetNotesModel(true)}>
            <View
              style={[
                globalStyles.btn_01,
                {
                  flexDirection: "row",
                  justifyContent: "center",
                  paddingHorizontal: 15,
                  marginVertical: 0,
                },
              ]}
            >
              {/* <Image
                source={require(`../../../../../assets/icons/cuwhite.png`)}
                style={styles.icon}
              /> */}
              <Text style={[globalStyles.text_label_btn01, {}]}>Add Notes</Text>
            </View>
          </TouchableOpacity>
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
                    paddingHorizontal: 7,
                    flex: 0.49,
                  },
                ]}
              >
                <Text
                  style={[globalStyles.text_label_btn01, { marginLeft: 5 }]}
                >
                  Customer Notes
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
                    paddingHorizontal: 7,
                    flex: 0.49,
                  },
                ]}
              >
                <Text
                  style={[globalStyles.text_label_btn01, { marginLeft: 5 }]}
                >
                  Accepting Notes
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
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
        <View style={globalStyles.br_10}></View>
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
function ViewNotes(props) {
  const { token, API_URL, request } = useContext(MyContext);

  const [body, setBody] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    if (props.showViewNotesModel) {
      
      if (props.type === "Customer") {
        setBody(request?.customerNotes?.text);
        setSelectedImage(request?.customerNotes?.image);
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

function ValetNotes(props) {
  const { token, API_URL, request, updateRequest } = useContext(MyContext);

  // const [vehicle, setVehicle] = useState("");
  // const [vehicleError, setVehicleError] = useState(false);

  const [body, setBody] = useState(request?.workerComment?.text);

  useEffect(() => {
    if (props.showValetNotesModel) {
      setBody(request?.workerComment);
    }
  }, [props.showValetNotesModel]);
  const addMyNotes = async () => {
    let to_process = true;

    if (to_process) {
      try {
        

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.post(
          `${API_URL}/api/worker/updateParkingNotes/${request._id}`,
          {"comment":body},
          { headers }
        );
        updateRequest(token, request._id);
        setBody("");
        alert("Notes Updated!");
        props.close();
      } catch (error) {
        console.error("Error :", error.response);
      }
    }
  };
  return (
    <View>
      <Modal isVisible={props.showValetNotesModel}>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  col1: {
    flex: 0.49,
    height: "100%",
  },
});

export default Worker_vehicle_requested;
