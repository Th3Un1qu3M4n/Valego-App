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

function User_setting() {
  const [showEditProfileModel, setShowEditProfileModel] = useState(false);
  const [showAddVehicleModel, setShowAddVehicleModel] = useState(false);
  const [showChangeVehicleModel, setShowChangeVehicleModel] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <SafeAreaView style={[globalStyles.view_screen, { height: "100%" }]}>
      <Header style={{ backgroundColor: "blue" }} />

      <EditProfileModel
        showEditProfileModel={showEditProfileModel}
        close={() => setShowEditProfileModel(false)}
      />
      <AddNewVehicleModel
        showAddVehicleModel={showAddVehicleModel}
        close={() => setShowAddVehicleModel(false)}
      />
      <ChangeCurrentVehicleModel
        showChangeVehicleModel={showChangeVehicleModel}
        close={() => setShowChangeVehicleModel(false)}
      />

      <ShowHistoryModel
        showChangeVehicleModel={showHistory}
        close={() => setShowHistory(false)}
      />
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
        <TouchableWithoutFeedback
          onPress={() => setShowChangeVehicleModel(true)}
        >
          <View style={styles.row}>
            <Image
              source={require("../../../../../assets/icons/cv.png")} // Replace with your actual icon path
              style={styles.icon}
            />
            <Text style={globalStyles.text_label_setting}>Change Vehicle</Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.lineStyle} />
        <TouchableWithoutFeedback onPress={() => setShowAddVehicleModel(true)}>
          <View style={styles.row}>
            <Image
              source={require("../../../../../assets/icons/av.png")} // Replace with your actual icon path
              style={styles.icon}
            />
            <Text style={globalStyles.text_label_setting}>Add Vehicle</Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.lineStyle} />
        <View style={styles.row}>
          <Image
            source={require("../../../../../assets/icons/info.png")} // Replace with your actual icon path
            style={styles.icon}
          />
          <Text style={globalStyles.text_label_setting}>Payment info</Text>
        </View>
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
        <View style={styles.row}>
          <Image
            source={require("../../../../../assets/icons/au.png")} // Replace with your actual icon path
            style={styles.icon}
          />
          <Text style={globalStyles.text_label_setting}>About us</Text>
        </View>
        <View style={styles.lineStyle} />
        <View style={styles.row}>
          <Image
            source={require("../../../../../assets/icons/tc.png")} // Replace with your actual icon path
            style={styles.icon}
          />
          <Text style={globalStyles.text_label_setting}>
            Terms and Conditions
          </Text>
        </View>
        <View style={styles.lineStyle} />
        <View style={styles.row}>
          <Image
            source={require("../../../../../assets/icons/shield.png")} // Replace with your actual icon path
            style={styles.icon}
          />
          <Text style={globalStyles.text_label_setting}>Privacy Terms</Text>
        </View>
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

function AddNewVehicleModel(props) {
  const { token, API_URL } = useContext(MyContext);

  const [vehicle, setVehicle] = useState("");
  const [vehicleError, setVehicleError] = useState(false);

  const [licensePlate, setLicensePlate] = useState("");
  const [licensePlateError, setLicensePlateError] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
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
  const addVehicle = async () => {
    let to_process = true;
    if (
      vehicle.localeCompare("") == 0 ||
      vehicle.localeCompare(" ") == 0 ||
      vehicle.localeCompare(null) == 0 ||
      !showImage
    ) {
      setVehicleError(true);
      to_process = false;
    } else setVehicleError(false);

    if (
      licensePlate.localeCompare("") == 0 ||
      licensePlate.localeCompare(" ") == 0 ||
      licensePlate.localeCompare(null) == 0
    ) {
      setLicensePlateError(true);
      to_process = false;
    } else setLicensePlateError(false);

    if (to_process) {
      try {
        const uri = selectedImage;
        const uriParts = uri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        const formData = new FormData();
        formData.append("vehicleImage", {
          uri,
          name: Date.now() + `.${fileType}`,
          type: `image/${fileType}`,
        });
        formData.append("vehicleName", vehicle);
        formData.append("plates", licensePlate);
        const headers = {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        };

        console.log(formData);

        const response = await axios.post(
          `${API_URL}/api/customer/vehicle/`,
          formData,
          { headers }
        );

        // console.log("API Response:", response.data);
        alert("New Vehicle Added!");
        props.close();
      } catch (error) {
        console.error("Error sending image to API:", error);
      }
    }
  };
  return (
    <View>
      <Modal isVisible={props.showAddVehicleModel}>
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
                <Text style={globalStyles.text_label_heading}>Add Vehicle</Text>
              </View>
              <View style={globalStyles.br_10}></View>
              <Text style={globalStyles.text_label_input}>Vehicle</Text>
              <View style={[globalStyles.text_input, styles.row]}>
                <TextInput
                  style={globalStyles.text_label_input_text}
                  placeholder="BMW"
                  value={vehicle}
                  onChangeText={(e) => setVehicle(e)}
                />
                <TouchableOpacity onPress={pickImageAsync}>
                  <Image
                    source={require("../../../../../assets/icons/a.png")} // Replace with your actual icon path
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
              {vehicleError && (
                <Text style={globalStyles.text_label_red}>
                  *Vehicle with photo is required.....
                </Text>
              )}
              <Text style={globalStyles.text_label_red}>
                *Add photo of your vehicle in which number plate, color and
                brand is visible
              </Text>
              {showImage && (
                <Image
                  source={{ uri: selectedImage }}
                  style={{ width: 100, height: 100, resizeMode: "contain" }}
                />
              )}

              <Text style={globalStyles.text_label_input}>License Plate</Text>
              <TextInput
                style={globalStyles.text_input}
                value={licensePlate}
                onChangeText={(e) => setLicensePlate(e)}
                placeholder={"ABC-22-1234"}
              />
              {licensePlateError && (
                <Text style={globalStyles.text_label_red}>
                  *License Plate is required.....
                </Text>
              )}
              <View style={globalStyles.br_10}></View>

              <TouchableOpacity
                style={globalStyles.btn_01}
                onPress={addVehicle}
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
function ChangeCurrentVehicleModel(props) {
  const { user, token, API_URL } = useContext(MyContext);

  const [selectedvehicle, setSelectedVehicle] = useState(user.vehicle);
  const [vehicleList, setVehicleList] = useState([]);

  const getActiveRequestsData = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      axios
        .get(`${API_URL}/api/customer/vehicle`, { headers })
        .then((res) => {
          setVehicleList(res.data.vehicles);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  useEffect(() => {
    if (props.showChangeVehicleModel) {
      getActiveRequestsData();
    }
  }, [props.showChangeVehicleModel]);

  const changeVehicle = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        `${API_URL}/api/customer/vehicle/${selectedvehicle}`,
        {},
        { headers }
      );

      console.log("API Response:", response.data);
      alert("Vehicle Changed!");
      props.close();
    } catch (error) {
      console.error("Error sending image to API:", error);
    }
  };
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
                <Text style={globalStyles.text_label_heading}>
                  Change Vehicle
                </Text>
              </View>
              <View style={globalStyles.br_10}></View>
              <View
                style={{
                  maxHeight: 200,
                  minHeight: 150,
                }}
              >
                <ScrollView horizontal>
                  <View style={styles.cardContainerHoriontal}>
                    {vehicleList.map((item, index) => {
                      return (
                        <TouchableOpacity
                          onPress={() => setSelectedVehicle(item._id)}
                          key={item?._id}
                          style={{ width: 120 }}
                        >
                          <View
                            style={[
                              globalStyles.card_02,
                              {
                                backgroundColor:
                                  selectedvehicle === item._id
                                    ? "#1a344f"
                                    : "#fff",
                                width: "100%",
                                color:
                                  selectedvehicle === item._id
                                    ? "#fff"
                                    : "#1a344f",
                              },
                            ]}
                            key={index}
                          >
                            <Image
                              // source={require("../../../../../assets/images/car.png")}
                              source={{
                                uri: `${API_URL}/${item.vehicleImage}`,
                              }}
                              style={styles.car_img_dashboard}
                            />
                            <Text
                              style={[
                                globalStyles.text_label_card_02_head,
                                {
                                  color:
                                    selectedvehicle === item._id
                                      ? "#fff"
                                      : "#1a344f",
                                },
                              ]}
                            >
                              {item.vehicleName}
                            </Text>
                            <Text
                              style={[
                                globalStyles.text_label_card_02,
                                {
                                  color:
                                    selectedvehicle === item._id
                                      ? "#fff"
                                      : "#1a344f",
                                },
                              ]}
                            >
                              {item.plates}
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
                style={globalStyles.btn_01}
                onPress={changeVehicle}
                disabled={!selectedvehicle}
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
                                  {request.workerId.companyId?.name}
                                </Text>
                              </View>
                              <View>
                                <Text
                                  style={globalStyles.text_label_card_heading}
                                >
                                  {request.isPaymentMade ? "CARD" : "CASH"}
                                </Text>
                              </View>
                            </View>
                            <Text style={globalStyles.text_label_card}>
                              Vehicle: {request.vehicleId.vehicleName}{" "}
                              {request.vehicleId.plates}
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
                                request.checkOutTime
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Text>
                            <Text style={globalStyles.text_label_card}>
                              Date:{" "}
                              {new Date(request.checkInTime).toLocaleDateString(
                                [],
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </Text>
                            <Text style={globalStyles.text_label_card}>
                              Amount:{" "}
                              {(request.amount / 100).toLocaleString("en-US", {
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
export default User_setting;
