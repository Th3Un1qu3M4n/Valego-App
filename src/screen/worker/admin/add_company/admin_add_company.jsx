import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Header from "../../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../../global/globalStyles";
import { MyContext } from "../../../../../context/tokenContext";
import axios from "axios";

export default function Admin_add_company({ route }) {
  const { edit, company } = route.params;
  console.log(company);
  const { token, API_URL } = useContext(MyContext);

  const [fullName, setFullName] = useState("");
  const [fullNameError, setFullNameError] = useState(false);

  const [accountId, setAccountId] = useState("");
  const [accountIdError, setAccountIdError] = useState(false);

  const [chargeAmount, setChargeAmount] = useState("");
  const [chargeAmountError, setChargeAmountError] = useState(false);

  const [feeAmount, setFeeAmount] = useState("");
  const [feeAmountError, setFeeAmountError] = useState(false);

  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);
  useEffect(() => {
    if (edit) {
      setFullName(company.name);
      setAccountId(company.accountId);
      setAddress(company.address);
      try {
        setFeeAmount(company.applicationFeeAmount.toString());
        setChargeAmount(company.totalChargeAmount.toString());
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

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
      accountId.localeCompare("") == 0 ||
      accountId.localeCompare(" ") == 0 ||
      accountId.localeCompare(null) == 0
    ) {
      setAccountIdError(true);
      to_process = false;
    } else setAccountIdError(false);

    if (
      chargeAmount.localeCompare("") == 0 ||
      chargeAmount.localeCompare(" ") == 0 ||
      chargeAmount.localeCompare(null) == 0 ||
      Number(chargeAmount) < 1000
    ) {
      setChargeAmountError(true);
      to_process = false;
    } else setChargeAmountError(false);

    if (
      feeAmount.localeCompare("") == 0 ||
      feeAmount.localeCompare(" ") == 0 ||
      feeAmount.localeCompare(null) == 0
    ) {
      setFeeAmountError(true);
      to_process = false;
    } else setFeeAmountError(false);

    if (
      address.localeCompare("") == 0 ||
      address.localeCompare(" ") == 0 ||
      address.localeCompare(null) == 0
    ) {
      setAddressError(true);
      to_process = false;
    } else setAddressError(false);

    if (to_process) {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        if (edit) {
          const response = await axios.put(
            `${API_URL}/api/company/${company._id}`,
            {
              totalChargeAmount: chargeAmount,
              accountId: accountId,
              name: fullName,
              applicationFeeAmount: feeAmount,
              address: address,
            },
            { headers }
          );
          alert("Company Update!");
        } else {
          const response = await axios.post(
            `${API_URL}/api/company`,
            {
              totalChargeAmount: chargeAmount,
              accountId: accountId,
              name: fullName,
              applicationFeeAmount: feeAmount,
              address: address,
            },
            { headers }
          );
          alert("Company Registered!");
          setFullName("");
          setAccountId("");
          setChargeAmount("");
          setFeeAmount("");
          setAddress("");
        }
      } catch (error) {
        console.error("Error:", error.response.data.message);
        alert(error.response.data.message);
      }
    }
    // navigation.navigate("worker_vehicle_requested", {});
  };
  return (
    <SafeAreaView style={globalStyles.view_screen}>
      <Header />
      <ScrollView>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={globalStyles.text_label_heading}>
            {edit ? "Edit" : "Add"} Company
          </Text>
        </View>
        <Text style={globalStyles.text_label_input}>
          Company ID: {company._id}
        </Text>

        <Text style={globalStyles.text_label_input}>Company Name</Text>
        <TextInput
          style={globalStyles.text_input}
          placeholder={"Company A"}
          value={fullName}
          onChangeText={(e) => setFullName(e)}
        />
        {fullNameError && (
          <Text style={globalStyles.text_label_red}>
            *Fullname is required.....
          </Text>
        )}
        <Text style={globalStyles.text_label_input}>Account ID:</Text>
        <TextInput
          style={globalStyles.text_input}
          placeholder={"acz_213123"}
          value={accountId}
          onChangeText={(e) => setAccountId(e)}
        />
        {accountIdError && (
          <Text style={globalStyles.text_label_red}>
            *Account Id is required.....
          </Text>
        )}
        <Text style={globalStyles.text_label_input}>Total Charge Amount:</Text>
        <TextInput
          style={globalStyles.text_input}
          keyboardType="number-pad"
          placeholder={"100 cents"}
          value={chargeAmount}
          onChangeText={(e) => setChargeAmount(e)}
        />
        {chargeAmountError && (
          <Text style={globalStyles.text_label_red}>
            *Charge Amount is required.....
          </Text>
        )}
        <Text style={globalStyles.text_label_red}>
          *Total Charge Amount should not be less than 1000 cents
        </Text>
        <Text style={globalStyles.text_label_input}>
          Application Fee Amount:
        </Text>
        <TextInput
          style={globalStyles.text_input}
          keyboardType="number-pad"
          placeholder={"100 cents"}
          value={feeAmount}
          onChangeText={(e) => setFeeAmount(e)}
        />
        {feeAmountError && (
          <Text style={globalStyles.text_label_red}>
            *Fee Amount is required.....
          </Text>
        )}
        <Text style={globalStyles.text_label_red}>
          *Fee Amount must be less than Total Charge Amount
        </Text>
        <Text style={globalStyles.text_label_input}>Address:</Text>
        <TextInput
          style={globalStyles.text_input}
          placeholder={"Abc Street, XYX Avenue"}
          value={address}
          onChangeText={(e) => setAddress(e)}
        />
        {addressError && (
          <Text style={globalStyles.text_label_red}>
            *Address is required.....
          </Text>
        )}
        <TouchableOpacity style={globalStyles.btn_01} onPress={onBtnClick}>
          {!edit ? (
            <Text style={globalStyles.text_label_btn01}>Add Company</Text>
          ) : (
            <Text style={globalStyles.text_label_btn01}>Edit Company</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
