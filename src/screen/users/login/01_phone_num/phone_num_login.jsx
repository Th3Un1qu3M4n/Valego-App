import React, { useState, useRef, useContext } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Link } from "@react-navigation/native";
import Header from "../../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../../global/globalStyles";
import {
  getAuth,
  onAuthStateChanged,
  PhoneAuthProvider,
  User,
} from "firebase/auth";
import { FirebaseRecaptchaVerifierModal } from "../../../../expo-firebase-recaptcha-patch-main/firebase-recaptcha/modal";
import { firebaseConfig } from "../../../../../config/firebaseConfig";
import { MyContext } from "../../../../../context/tokenContext";
import axios from "axios";
import PhoneInput from "react-native-phone-number-input";
function User_phone_num_login({ navigation }) {
  const { text, setText, API_URL } = useContext(MyContext);
  const [loader, setLoader] = useState(false);
  const [secret, setSecret] = useState("");

  const [userPhone, setUserPhone] = useState("");
  const auth = getAuth();

  const FirebaseRecaptchaRef = useRef(null);
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const phoneInputRef = useRef(null);

  const onBtnClick = () => {
    send_auth_number(userPhone);
  };

  const checkIfSecretCodeValid = async (secret) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/checkWorkerToken`,
        { code: secret }
      );
      // console.log(response.data)
      if (response.data.valid) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const send_auth_number = async (phone_num) => {
    try {
      setLoader(true);

      const isSecretCodeValid = await checkIfSecretCodeValid(secret);
      console.log("isSecretCodeValid", isSecretCodeValid);
      if (isSecretCodeValid) {
        navigation.navigate("worker_login");
        setLoader(false);
        return;
      } else {
        const provider = new PhoneAuthProvider(auth);
        const verification_id = await provider.verifyPhoneNumber(
          phone_num,
          FirebaseRecaptchaRef.current
        );
        console.log(verification_id);
        if (verification_id) {
          navigation.navigate("user_otp", { verification_id });
        }
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  return (
    <SafeAreaView style={globalStyles.view_screen}>
      <Header />

      <FirebaseRecaptchaVerifierModal
        ref={FirebaseRecaptchaRef}
        firebaseConfig={firebaseConfig}
      />
      <View>
        <Text style={globalStyles.text_label_input}>Phone Number</Text>
        <PhoneInput
          ref={phoneInputRef}
          defaultValue={userPhone}
          defaultCode="MX"
          layout="first"
          containerStyle={styles.phoneNumberInput}
          textContainerStyle={{ backgroundColor: "#fff", width: "100%" }}
          onChangeText={(text) => {
            console.log("text", text);
            setSecret(text);
          }}
          onChangeFormattedText={(text) => {
            console.log("formatted", text);
            setUserPhone(text);
          }}
          // withDarkTheme
          withShadow
          autoFocus
        />
        {/* <TextInput
          // text field
          keyboardType="default"
          style={globalStyles.text_input}
          value={userPhone}
          onChangeText={(e) => setUserPhone(e)}
          placeholder={"+52 1234 567 890"}
        /> */}

        <TouchableOpacity
          style={globalStyles.btn_01}
          onPress={onBtnClick}
          disabled={loader}
        >
          <Text style={globalStyles.text_label_btn01}>
            {loader ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              "Log in"
            )}
          </Text>
        </TouchableOpacity>
        <View style={globalStyles.br_15}></View>
        {/* <Link
          style={globalStyles.link_01}
          to={{ screen: "worker_login", params: {} }}
        >
          Sign in as a Valet Worker
        </Link> */}
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

const styles = {
  phoneNumberInput: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
};

export default User_phone_num_login;
