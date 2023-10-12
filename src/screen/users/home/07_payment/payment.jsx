import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,TouchableOpacity
} from "react-native";
import { Link } from "@react-navigation/native";
import Header from "../../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../../global/globalStyles";

function User_payment({ navigation }) {
  const [cash, setCash] = useState(true);

  const onBtnClick = () => {
    navigation.navigate("user_in_process", {});
  };
  return (
    <SafeAreaView style={[globalStyles.view_screen,{height:"100%"}]}>
      <Header />
      <View >
        <Text style={globalStyles.text_label_heading}>Total: $25 MXN </Text>
        <View style={{width:"100%", justifyContent:"center", alignItems:"center"}}>
        <Image
          source={require("../../../../../assets/icons/card.png")}
          style={[globalStyles.image_screen,{height:300}]}
          
        />
        </View>
        {/* <Text>Please select payment method</Text>
        <View style={{ flexDirection: "row", backgroundColor: "#1a344f" }}>
          <TouchableWithoutFeedback onPress={() => setCash(true)}>
            <View
              style={cash ? styles.switch_selected : styles.switch_notselected}
            >
              <Text style={{ color: cash ? "#1a344f" : "#fff" }}>Cash</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => setCash(false)}>
            <View
              style={!cash ? styles.switch_selected : styles.switch_notselected}
            >
              <Text style={{ color: !cash ? "#1a344f" : "#fff" }}>Card</Text>
            </View>
          </TouchableWithoutFeedback>
        </View> */}
        <View style={globalStyles.br_10}></View>
        <TouchableOpacity  style={globalStyles.btn_01} onPress={onBtnClick} >
          <Text style={globalStyles.text_label_btn01}>Pay now</Text>
        </TouchableOpacity>

        
      </View>
      <View style={{ position: "absolute", bottom: 20, left:20 }}>
          <Link style={globalStyles.link_01} to={{ screen: "contactus", params: {} }}>Report a Problem</Link>
          <Link style={globalStyles.link_01} to={{ screen: "contactus", params: {} }}>Contact us</Link>
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
    backgroundColor: "#fff",
    borderRadius: 5,
    flex: 0.5,
  },
  switch_notselected: {
    backgroundColor: "#1a344f",
    borderRadius: 5,
    flex: 0.5,
  },
});
export default User_payment;
