import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { Link } from "@react-navigation/native";
import Header from "../../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../../global/globalStyles";

export default function Admin_dashboard({navigation}) {
  const onBtnClick = () => {
    navigation.navigate("worker_vehicle_requested", {});
  };
  return (
    <SafeAreaView style={globalStyles.view_screen}>
      <Header />
      <ScrollView>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={globalStyles.text_label_heading}>Admin Dashboard</Text>
        </View>

        <View style={styles.cardContainer}>
          <TouchableWithoutFeedback onPress={()=>{navigation.navigate("admin_all_worker", {})}}>
          <View
            style={[
              globalStyles.card_02,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <Image
              source={require("../../../../../assets/icons/adminIcons/manage.png")}
              style={styles.car_img_dashboard}
            />
            <Text style={globalStyles.text_label_card_02_head}>
              All Workers
            </Text>
          </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback  onPress={()=>{navigation.navigate("admin_add_worker", {})}}>

          <View
            style={[
              globalStyles.card_02,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <Image
              source={require("../../../../../assets/icons/adminIcons/add.png")}
              style={styles.car_img_dashboard}
            />
            <Text style={globalStyles.text_label_card_02_head}>Add Worker</Text>
          </View>
</TouchableWithoutFeedback>
          <TouchableWithoutFeedback  onPress={()=>{navigation.navigate("admin_add_company",  {edit:false, company: {}})}}>
            <View
              style={[
                globalStyles.card_02,
                { justifyContent: "center", alignItems: "center" },
              ]}
            >
              <Image
                source={require("../../../../../assets/icons/adminIcons/add_company.png")}
                style={styles.car_img_dashboard}
              />
              <Text style={globalStyles.text_label_card_02_head}>
                Add Company
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  car_img_dashboard: {
    resizeMode: "stretch",
    width: 100,
    height: 100,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 50,
  },
});
