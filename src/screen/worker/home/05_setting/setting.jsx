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
  ScrollView,
} from "react-native";
import { Link } from "@react-navigation/native";
import Header from "../../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../../global/globalStyles";
import Modal from "react-native-modal";
import { MyContext } from "../../../../../context/tokenContext";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { getAuth, signOut } from "firebase/auth";

function Worker_setting() {
  const { user, setRequest } = useContext(MyContext);

  const [showEditProfileModel, setShowEditProfileModel] = useState(false);
  const [showAddVehicleModel, setShowAddVehicleModel] = useState(false);
  const [showChangeVehicleModel, setShowChangeVehicleModel] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const auth = getAuth();

  const signout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
        setRequest(null);
        // You can add additional logic here after signout
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };
  return (
    <SafeAreaView style={[globalStyles.view_screen, { height: "100%" }]}>
      <Header style={{ backgroundColor: "blue" }} />

      <EditProfileModel
        showEditProfileModel={showEditProfileModel}
        close={() => setShowEditProfileModel(false)}
      />

      <ShowHistoryModel
        showChangeVehicleModel={showHistory}
        close={() => setShowHistory(false)}
      />
      <View
        style={{
          backgroundColor: "#fff",
          width: "95%",
          paddingHorizontal: 15,
          paddingVertical: 15,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Text style={globalStyles.text_label_heading}>
            {user?.companyId?.name}
          </Text>
          <Text style={globalStyles.text_label_input}>
            {user?.companyId?.address}
          </Text>
          <Text style={globalStyles.text_label_input}>
            Charges - $
            {user?.companyId?.totalChargeAmount
              ? user?.companyId?.totalChargeAmount / 100
              : ""}
          </Text>
        </View>
      </View>
      <View style={globalStyles.br_10}></View>
      <View style={{ height: "83%" }}>
        <TouchableWithoutFeedback onPress={() => setShowEditProfileModel(true)}>
          <View style={styles.row}>
            <Image
              source={require("../../../../../assets/icons/uu.png")} // Replace with your actual icon path
              style={styles.icon}
            />
            <Text style={globalStyles.text_label_setting}>Edit Profile</Text>
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.lineStyle} />
        <TouchableWithoutFeedback onPress={() => setShowHistory(true)}>
          <View style={styles.row}>
            <Image
              source={require("../../../../../assets/icons/h.png")} // Replace with your actual icon path
              style={styles.icon}
            />
            <Text style={globalStyles.text_label_setting}>History</Text>
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.lineStyle} />
        <TouchableWithoutFeedback onPress={signout}>
          <View style={styles.row}>
            <Image
              source={require("../../../../../assets/icons/logout.png")} // Replace with your actual icon path
              style={styles.icon}
            />
            <Text style={globalStyles.text_label_setting}>Sign out</Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.lineStyle} />
      </View>
      <View style={{ position: "absolute", bottom: 10, left: 20 }}>
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

function EditProfileModel(props) {
  const { user, setUser, token, API_URL } = useContext(MyContext);
  console.log("user,email", user);

  const [fullName, setFullName] = useState(user.name);
  const [fullNameError, setFullNameError] = useState(false);

  const [email, setEmail] = useState(user.email);
  const [emailError, setEmailError] = useState(false);

  const validateEmail = () => {
    // Regular expression for a basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(email)) {
      return true;
    } else {
      return false;
    }
  };

  const updateProfile = async () => {
    let to_process = true;
    if (
      fullName.localeCompare("") == 0 ||
      fullName.localeCompare(" ") == 0 ||
      fullName.localeCompare(null) == 0
    ) {
      setFullNameError(true);
      to_process = false;
    } else setFullNameError(false);

    if (
      email.localeCompare("") == 0 ||
      email.localeCompare(" ") == 0 ||
      email.localeCompare(null) == 0 ||
      !validateEmail()
    ) {
      setEmailError(true);
      to_process = false;
    } else setEmailError(false);

    if (to_process) {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.post(
          `${API_URL}/api/auth/updateProfile`,
          {
            name: fullName,
            email: email,
          },
          { headers }
        );
        console.log("4");

        console.log("API Response:", response.data);
        setUser(response.data.user);
        alert("Profile Updated!");
        props.close();
      } catch (error) {
        console.error("Error sending image to API:", error);
      }
    }
  };
  return (
    <View>
      <Modal isVisible={props.showEditProfileModel}>
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
                  Update Profile
                </Text>
              </View>
              <View style={globalStyles.br_10}></View>
              <Text style={globalStyles.text_label_input}>Full name</Text>
              <TextInput
                style={globalStyles.text_input}
                value={fullName}
                onChangeText={(e) => setFullName(e)}
                placeholder={"Olivia Price"}
              />
              {fullNameError && (
                <Text style={globalStyles.text_label_red}>
                  *Fullname is required.....
                </Text>
              )}
              <Text style={globalStyles.text_label_input}>Email</Text>
              <TextInput
                style={globalStyles.text_input}
                keyboardType="email-address"
                value={email}
                aria-disabled={true}
                editable={false}
                onChangeText={(e) => setEmail(e)}
                placeholder={"OliviaPrice1234@gmail.com"}
              />
              {emailError && (
                <Text style={globalStyles.text_label_red}>
                  *Correct Email is required.....
                </Text>
              )}
              <View style={globalStyles.br_10}></View>

              <TouchableOpacity
                style={globalStyles.btn_01}
                onPress={updateProfile}
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

function ShowHistoryModel(props) {
  const { user, token, API_URL } = useContext(MyContext);

  const [requestList, setRequestList] = useState([]);

  const getCompletedRequestsData = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      axios
        .get(`${API_URL}/api/customer/completed`, { headers })
        .then((res) => {
          setRequestList(res.data);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  useEffect(() => {
    if (props.showChangeVehicleModel) {
      getCompletedRequestsData();
    }
  }, [props.showChangeVehicleModel]);

  return (
    <View>
      <Modal isVisible={props.showChangeVehicleModel}>
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
                <Text style={globalStyles.text_label_heading}>HISTORY</Text>
              </View>
              <View style={globalStyles.br_10}></View>
              <View
                style={{
                  maxHeight: 400,
                  minHeight: 350,
                }}
              >
                <ScrollView>
                  <View style={styles.cardContainer}>
                    {requestList.map((request, index) => {
                      return (
                        <TouchableOpacity
                          style={globalStyles.card}
                          key={request?._id || index}
                        >
                          {/* <View style={{}}> */}
                          <View>
                            <Image
                              source={require("../../../../../assets/icons/uu.png")}
                              style={styles.icon}
                            />
                          </View>
                          <View style={globalStyles.card_content}>
                            {/* <View style={{}}> */}
                            <View style={styles.spacedRow}>
                              <View>
                                <Text
                                  style={globalStyles.text_label_card_heading}
                                  // style={{}}
                                >
                                  {request?.userId?.name}
                                </Text>
                              </View>
                              <View>
                                <Text
                                  style={globalStyles.text_label_card_heading}
                                >
                                  {request?.isPaymentMade ? "CARD" : "CASH"}
                                </Text>
                              </View>
                            </View>
                            <Text style={globalStyles.text_label_card}>
                              Vehicle: {request?.vehicleId?.vehicleName}{" "}
                              {request?.vehicleId?.plates}
                            </Text>
                            <Text style={globalStyles.text_label_card}>
                              Admission time:{" "}
                              {new Date(request.checkInTime).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </Text>
                            <Text style={globalStyles.text_label_card}>
                              Checkout time:{" "}
                              {new Date(
                                request?.checkOutTime
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Text>
                            <Text style={globalStyles.text_label_card}>
                              Date:{" "}
                              {new Date(
                                request?.checkInTime
                              ).toLocaleDateString([], {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </Text>
                            <Text style={globalStyles.text_label_card}>
                              Amount:{" "}
                              {(request?.amount / 100).toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
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
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  spacedRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 30,
    width: "100%",
  },
  icon: {
    width: 28, // Set the width of your icon
    height: 28, // Set the height of your icon
    marginRight: 8, // Adjust margin as needed
    resizeMode: "contain",
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: "#d3d3d3",
    margin: 10,
  },
  rowText: {
    flex: 0.8,
  },
  bottomView: {
    position: "absolute", //Here is the trick
    bottom: 0, //Here is the trick
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
    // backgroundColor: "red",
    padding: 10,
  },
  cardContainerHoriontal: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
    // backgroundColor: "red",
    padding: 10,
  },
  car_img_dashboard: {
    resizeMode: "stretch",
    width: "100%",
    height: 100,
  },
});
export default Worker_setting;
