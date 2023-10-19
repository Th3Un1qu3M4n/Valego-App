import React, { useState, useContext } from "react";
import { Text, View, TextInput, Button, TouchableOpacity,ActivityIndicator } from "react-native";
import { Link } from "@react-navigation/native";
import Header from "../../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../../global/globalStyles";
import {
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { MyContext } from "../../../../../context/tokenContext";

function User_otp({ route, navigation }) {
  const { setToken, API_URL } = useContext(MyContext);
  const [otp, setOtp] = useState("");
  const [loader, setLoader] = useState(false);

  const { verification_id } = route.params;

  const auth = getAuth();

  const onBtnClick = () => {
    

    verifyUser(otp);

  };

  const verifyUser = async (otp) => {
    try {
      setLoader(true);
      const loggedInUser = auth.currentUser;
      if (loggedInUser) {
        // logout
        await auth.signOut();
      }

      const credential = PhoneAuthProvider.credential(verification_id, otp);
      const user = await signInWithCredential(auth, credential);
      console.log("user", user);
      const token = await auth.currentUser.getIdToken(true);
      setToken(token);
      // console.log(user);
    setLoader(false);

    } catch (error) {
      console.log(error);
    setLoader(false);
      
      alert("Invalid OTP");

    }
  };
  return (
    <SafeAreaView style={globalStyles.view_screen}>
      <Header />
      <View>
        <Text style={globalStyles.text_label_input}>OTP</Text>
        <TextInput
          style={globalStyles.text_input}
          keyboardType="numeric"
          value={otp}
          onChangeText={(e) => setOtp(e)}
          placeholder={"your password...."}
        />
        <TouchableOpacity style={globalStyles.btn_01} onPress={onBtnClick} disabled={loader}>
          <Text style={globalStyles.text_label_btn01}>{loader?<ActivityIndicator size="large" color="#fff"/> : "Confirm OTP"}</Text>
        </TouchableOpacity>
        <View style={globalStyles.br_15}></View>

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

export default User_otp;
