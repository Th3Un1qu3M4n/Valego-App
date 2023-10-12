import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { Link } from "@react-navigation/native";
import Header from "../../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../../global/globalStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

import { MyContext } from "../../../../../context/tokenContext";
import Toggle from "react-native-toggle-input";

function User_info({ navigation }) {
  const { token, API_URL, setIsUserReg } = useContext(MyContext);

  const [fullName, setFullName] = useState("");
  const [fullNameError, setFullNameError] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [vehicle, setVehicle] = useState("");
  const [vehicleError, setVehicleError] = useState(false);

  const [licensePlate, setLicensePlate] = useState("");
  const [licensePlateError, setLicensePlateError] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardNumberError, setCardNumberError] = useState(false);

  const [ccv, setCCV] = useState("");
  const [ccvError, setCCVError] = useState(false);

  const [expiringDate, setExpiringDate] = useState("");
  const [expiringDateError, setExpiringDateError] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [showImage, setShowImage] = useState(false);

  const [toggle, setToggle] = React.useState(false);
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
  const validateEmail = () => {
    // Regular expression for a basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(email)) {
      return true;
    } else {
      return false;
    }
  };
  const onBtnClick = async () => {
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

    if (
      (cardNumber.localeCompare("") == 0 ||
        cardNumber.localeCompare(" ") == 0 ||
        cardNumber.localeCompare(null) == 0) &&
      !toggle
    ) {
      setCardNumberError(true);
      to_process = false;
    } else setCardNumberError(false);

    if (
      (ccv.localeCompare("") == 0 ||
        ccv.localeCompare(" ") == 0 ||
        ccv.localeCompare(null) == 0) &&
      !toggle
    ) {
      setCCVError(true);
      to_process = false;
    } else setCCVError(false);

    if (
      (expiringDate.localeCompare("") == 0 ||
        expiringDate.localeCompare(" ") == 0 ||
        expiringDate.localeCompare(null) == 0) &&
      !toggle
    ) {
      setExpiringDateError(true);
      to_process = false;
    } else setExpiringDateError(false);

    if (to_process) {
      console.log("1");

      const uri = selectedImage;
      const uriParts = uri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const formData = new FormData();
      formData.append("vehicleImage", {
        uri,
        name: Date.now() + `.${fileType}`,
        type: `image/${fileType}`,
      });
      // formData.append('file', imageFile);

      formData.append("vehicleName", vehicle);
      formData.append("plates", licensePlate);
      formData.append("name", fullName);
      formData.append("email", email);
      console.log("2");
      try {
        // Replace 'YOUR_API_ENDPOINT' with the actual endpoint
        const headers = {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        };
        console.log(formData);

        const response = await axios.post(
          `${API_URL}/api/auth/addProfile`,
          formData,
          { headers }
        );
        console.log("4");

        console.log("API Response:", response.data);
        // navigation.navigate("user_qrcode_scanner", {});
        setIsUserReg(true);

        // Handle the API response as needed
      } catch (error) {
        console.error("Error sending image to API:", error);
        console.log("5");

        // Handle errors
      }
    }
  };
  return (
    <SafeAreaView style={globalStyles.view_screen}>
      <Header />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
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
          *Add photo of your vehicle in which number plate, color and brand is
          visible
        </Text>
        {showImage && (
          <Image
            source={{ uri: selectedImage }}
            style={{ width: 100, height: 100, resizeMode: "contain" }}
          />
        )}
        <View style={styles.row}>
          <View style={styles.col1}>
            <Text style={globalStyles.text_label_input}>License Plate</Text>
            <TextInput
              style={globalStyles.text_input}
              value={licensePlate}
              onChangeText={(e) => setLicensePlate(e)}
              placeholder={"02/12/1999"}
            />
            {licensePlateError && (
              <Text style={globalStyles.text_label_red}>
                *License Plate is required.....
              </Text>
            )}
          </View>

          <View style={styles.col1}>
            <Text style={globalStyles.text_label_input}>Card Number</Text>
            <TextInput
              style={globalStyles.text_input}
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={(e) => setCardNumber(e)}
              placeholder={"1234 5678 9012"}
            />
            {!toggle && cardNumberError && (
              <Text style={globalStyles.text_label_red}>
                *Card Number is required.....
              </Text>
            )}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col1}>
            <Text style={globalStyles.text_label_input}>CCV</Text>
            <TextInput
              style={globalStyles.text_input}
              keyboardType="numeric"
              value={ccv}
              onChangeText={(e) => setCCV(e)}
              placeholder={"1234"}
            />
            {!toggle && ccvError && (
              <Text style={globalStyles.text_label_red}>
                *Card CCV is required.....
              </Text>
            )}
          </View>
          <View style={styles.col1}>
            <Text style={globalStyles.text_label_input}>Expiring date</Text>
            {/* <TextInput
              style={globalStyles.text_input}
              value={otp}
              onChangeText={(e) => setOtp(e)}
              placeholder={"02/12/1999"}
            /> */}
            <View style={[globalStyles.text_input, styles.row]}>
              <Image
                source={require("../../../../../assets/icons/cal.png")} // Replace with your actual icon path
                style={styles.icon}
              />
              <TextInput
                style={globalStyles.text_label_input_text}
                placeholder="12/29"
                value={expiringDate}
                onChangeText={(e) => setExpiringDate(e)}
              />
            </View>
            {!toggle && expiringDateError && (
              <Text style={globalStyles.text_label_red}>
                *Card Expiring date is required.....
              </Text>
            )}
          </View>
        </View>
        <View style={globalStyles.br_3}></View>
        <View style={styles.row}>
          <Text style={[styles.rowText, globalStyles.text_label_input]}>
            Do not add card for now
          </Text>
          <Toggle
            color={"#1a344f"}
            size={20}
            filled={true}
            circleColor={"white"}
            toggle={toggle}
            setToggle={setToggle}
          />
        </View>
        <View style={globalStyles.br_3}></View>

        <TouchableOpacity style={globalStyles.btn_01} onPress={onBtnClick}>
          <Text style={globalStyles.text_label_btn01}>Contiune</Text>
        </TouchableOpacity>
        <Link
          style={globalStyles.link_01}
          to={{ screen: "contactus", params: {} }}
        >
          Contact us
        </Link>
        <View style={globalStyles.br_15}></View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
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
  rowText: {
    flex: 1,
  },
  textInput: {
    padding: 8, // Adjust padding as needed
    borderColor: "gray",
    borderWidth: 1,
    flex: 1, // Take remaining space in the row
  },
});

export default User_info;
