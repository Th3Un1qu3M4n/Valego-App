import React, { useState, useContext } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Linking
} from "react-native";
import { Link } from "@react-navigation/native";
import Header from "../../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../../global/globalStyles";
import { MyContext } from "../../../../../context/tokenContext";


function User_in_process({navigation}) {
  const { request } = useContext(MyContext);
  // console.log(request);
  const handleDialPress = () => {
    const phoneNumberToDial = `tel:${request.workerId.phone}`;
    Linking.openURL(phoneNumberToDial);
  };
  const onBtnClick = () => {
    navigation.navigate("user_waiting", {});
  };
  return (
    <SafeAreaView style={[globalStyles.view_screen,{height:"100%"}]}>
      <Header />
      <View >
        <Text style={globalStyles.text_label_heading}>Vehicle in process to deliver </Text>
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
              <Text  style={globalStyles.text_label_card_heading}>{request.workerId.companyId.name}</Text>
              <Text style={globalStyles.text_label_card}>Vehicle: {request.vehicleId.vehicleName} </Text>
              <Text style={globalStyles.text_label_card}>Check in hour: {new Date(request.checkInTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })} </Text>
              <Text style={globalStyles.text_label_card}>Price: ${request.workerId.companyId.totalChargeAmount / 100} MXN </Text>
            </View>
         
        </View>
        
        < TouchableOpacity onPress={handleDialPress}>
          <View style={[globalStyles.btn_01, {flexDirection:"row", justifyContent:"flex-start", paddingHorizontal:15}]}>
            <Image
              source={require(`../../../../../assets/icons/cuwhite.png`)}
              style={styles.icon}
            />
            <Text style={[globalStyles.text_label_btn01,{marginLeft:15}]}>Contact Valet Worker</Text>
          </View>
        </TouchableOpacity>

        
      </View>
      <View style={{position:"absolute", bottom:10, left:20}}>
        <Link style={globalStyles.link_01} to={{ screen: "contactus", params: {} }}>Report a Problem</Link>
        <Link style={globalStyles.link_01} to={{ screen: "contactus", params: {} }}>Contact us</Link>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  icon: {
    width: 24, // Set the width of your icon
    height: 24, // Set the height of your icon
    marginRight: 8, // Adjust margin as needed
    resizeMode: 'contain'
  },
  
});

export default User_in_process