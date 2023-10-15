import React, { useState, useRef, useContext } from "react";
import { Text, View, TextInput, Button, TouchableOpacity } from "react-native";
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
function User_phone_num_login({ navigation }) {
  const { text, setText, API_URL } = useContext(MyContext);
  const [userPhone, setUserPhone] = useState("");
  const auth = getAuth();
  const FirebaseRecaptchaRef = useRef(null);

  const onBtnClick = () => {
    send_auth_number(userPhone);
  };
  const send_auth_number = async (phone_num) => {
    try {
      const provider = new PhoneAuthProvider(auth);
      const verification_id = await provider.verifyPhoneNumber(
        phone_num,
        FirebaseRecaptchaRef.current
      );
      console.log(verification_id);
      if (verification_id) {
        navigation.navigate("user_otp", { verification_id });
      }
    } catch (error) {
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
        <TextInput
          keyboardType="phone-pad"
          style={globalStyles.text_input}
          value={userPhone}
          onChangeText={(e) => setUserPhone(e)}
          placeholder={"+52 1234 567 890"}
        />

        <TouchableOpacity style={globalStyles.btn_01} onPress={onBtnClick}>
          <Text style={globalStyles.text_label_btn01}>Log in</Text>
        </TouchableOpacity>
        <View style={globalStyles.br_15}></View>
        <Link
          style={globalStyles.link_01}
          to={{ screen: "worker_login", params: {} }}
        >
          Sign in as a Valet Worker
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

export default User_phone_num_login;
