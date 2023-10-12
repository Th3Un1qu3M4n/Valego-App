import React, { useState } from "react";
import { Text, View, TextInput, Button, StyleSheet, Image } from "react-native";
import { Link } from "@react-navigation/native";
import Header from "../../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../../global/globalStyles";

function User_setting() {
  return (
    <SafeAreaView style={[globalStyles.view_screen, { height: "100%" }]}>
      <Header style={{ backgroundColor: "blue" }} />
      <View style={{ height: "83%" }}>
        <View style={styles.row}>
          <Image
            source={require("../../../../../assets/icons/cv.png")} // Replace with your actual icon path
            style={styles.icon}
          />
          <Text style={globalStyles.text_label_setting}>Change Vehicle</Text>
        </View>
        <View style={styles.lineStyle} />
        <View style={styles.row}>
          <Image
            source={require("../../../../../assets/icons/av.png")} // Replace with your actual icon path
            style={styles.icon}
          />
          <Text style={globalStyles.text_label_setting}>Add Vehicle</Text>
        </View>
        <View style={styles.lineStyle} />
        <View style={styles.row}>
          <Image
            source={require("../../../../../assets/icons/info.png")} // Replace with your actual icon path
            style={styles.icon}
          />
          <Text style={globalStyles.text_label_setting}>Payment info</Text>
        </View>
        <View style={styles.lineStyle} />
        <View style={styles.row}>
          <Image
            source={require("../../../../../assets/icons/h.png")} // Replace with your actual icon path
            style={styles.icon}
          />
          <Text style={globalStyles.text_label_setting}>History</Text>
        </View>
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
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
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
});
export default User_setting;
