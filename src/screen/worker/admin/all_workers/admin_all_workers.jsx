import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Link } from "@react-navigation/native";
import Header from "../../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../../global/globalStyles";
import CompanyDropdownPicker from "../Component/CompanyDropdownPicker";
import { MyContext } from "../../../../../context/tokenContext";
import axios from "axios";

export default function Admin_all_workers({ navigation }) {
  const { token, API_URL } = useContext(MyContext);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCompanyDetails, setSelectedCompanyDetails] = useState(null);

  const [workerList, setWorkerList] = useState([]);

  useEffect(() => {
    const fetchCompanyWorkersData = async () => {
      try {
        // alert(selectedCompany);

        if (selectedCompany !== null) {
          // alert(selectedCompany);
          const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          };
          const response = await axios.get(
            `${API_URL}/api/worker/company/${selectedCompany}`,
            { headers }
          );
          let temp = [];
          for (const element of response.data) {
            temp.push({
              name: element.name,
              email: element.email,
              phone: element.phone,
              totalChargeAmount: element.companyId.totalChargeAmount,
            });
          }
          setWorkerList(temp);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyWorkersData();
  }, [selectedCompany]);

  const onBtnClick = () => {
    
    navigation.navigate("admin_add_company", {
      edit: true,
      company: selectedCompanyDetails,
    });
  };
  return (
    <SafeAreaView style={[globalStyles.view_screen, { height: "100%" }]}>
      <Header />
      <ScrollView style={{ height: "100%" }}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={globalStyles.text_label_heading}>All Workers</Text>
        </View>
        <CompanyDropdownPicker
          companyChanged={(companyid) => setSelectedCompany(companyid)}
          setCompanyDetails={(company) => setSelectedCompanyDetails(company)}
        />
        {selectedCompany && (
          <View
            style={{ width: "50%", position: "relative", marginLeft: "50%" }}
          >
            <TouchableOpacity
              style={globalStyles.btn_01}
              onPress={onBtnClick}
            >
              <Text style={globalStyles.text_label_btn01}>Edit Company</Text>
            </TouchableOpacity>
          </View>
        )}

        {workerList.map((emp) => {
          return (
            <View style={globalStyles.card}>
              <View>
                <Image
                  source={require("../../../../../assets/icons/uu.png")}
                  style={styles.icon}
                />
              </View>
              <View style={globalStyles.card_content}>
                <Text style={globalStyles.text_label_card_heading}>
                  {emp.name}
                </Text>
                <Text style={globalStyles.text_label_card}>{emp.email}</Text>
                <Text
                  style={[
                    globalStyles.text_label_card,
                    { fontFamily: "EncodeSansBold" },
                  ]}
                >
                  {emp.phone}
                </Text>
              </View>
              <View style={{ position: "absolute", right: 10, top: 10 }}>
                <Text style={globalStyles.text_label_card}>
                  ${emp.totalChargeAmount}
                </Text>
              </View>
            </View>
          );
        })}
        {workerList.length == 0 && (
          <View style={{ marginVertical: 150 }}></View>
        )}
        {workerList.length > 0 && workerList.length <= 3 && (
          <View style={{ marginVertical: 100 }}></View>
        )}
        {workerList.length > 3 && workerList.length <= 5 && (
          <View style={{ marginVertical: 50 }}></View>
        )}

        {/* <View style={globalStyles.card}>
          <View>
            <Image
              source={require("../../../../../assets/icons/uu.png")}
              style={styles.icon}
            />
          </View>
          <View style={globalStyles.card_content}>
            <Text style={globalStyles.text_label_card_heading}>
              Dawar Rajput
            </Text>
            <Text style={globalStyles.text_label_card}>
              <Image
                source={require("../../../../../assets/icons/adminIcons/star.png")}
                style={styles.icon_star}
              />
              {"  "}
              5.0 (9 Reviews){" "}
            </Text>
            <Text
              style={[
                globalStyles.text_label_card,
                { fontFamily: "EncodeSansBold" },
              ]}
            >
              12 Parking Jobs done{" "}
            </Text>
          </View>
          <View style={{ position: "absolute", right: 10, top: 10 }}>
            <Text style={globalStyles.text_label_card}>$54.71/hr</Text>
          </View>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  icon: {
    width: 32, // Set the width of your icon
    height: 32, // Set the height of your icon
    marginRight: 8, // Adjust margin as needed
    resizeMode: "contain",
  },
  icon_star: {
    width: 16, // Set the width of your icon
    height: 16, // Set the height of your icon
    marginRight: 8, // Adjust margin as needed

    resizeMode: "stretch",
  },
});
