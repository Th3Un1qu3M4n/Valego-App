import React, { useState, useContext, useRef } from "react";
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
  Alert,
} from "react-native";
import { Link } from "@react-navigation/native";
import Header from "../../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../../global/globalStyles";
import CompanyDropdownPicker from "../Component/CompanyDropdownPicker";
import { MyContext } from "../../../../../context/tokenContext";
import axios from "axios";
import PhoneInput from "react-native-phone-number-input";

export default function Admin_add_worker() {
  const { token, API_URL } = useContext(MyContext);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyDetails, setSelectedCompanyDetails] = useState(null);
  const [selectedCompanyError, setSelectedCompanyError] = useState(false);

  const [fullName, setFullName] = useState("");
  const [fullNameError, setFullNameError] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const phoneInputRef = useRef(null);

  const [pwd, setPwd] = useState("");
  const [pwdError, setPwdError] = useState(false);

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
    if (selectedCompany === "") {
      setSelectedCompanyError(true);
      to_process = false;
    } else setSelectedCompanyError(false);
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
      phoneNumber.localeCompare("") == 0 ||
      phoneNumber.localeCompare(" ") == 0 ||
      phoneNumber.localeCompare(null) == 0
    ) {
      setPhoneNumberError(true);
      to_process = false;
    } else setPhoneNumberError(false);

    if (
      pwd.localeCompare("") == 0 ||
      pwd.localeCompare(" ") == 0 ||
      pwd.localeCompare(null) == 0 ||
      pwd.length < 6
    ) {
      setPwdError(true);
      to_process = false;
    } else setPwdError(false);

    if (to_process) {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        console.log({
          email: email,
          password: pwd,
          name: fullName,
          companyId: selectedCompany,
          phoneNumber: phoneNumber,
        });
        const response = await axios.post(
          `${API_URL}/api/auth/register`,
          {
            email: email,
            password: pwd,
            name: fullName,
            companyId: selectedCompany,
            phoneNumber: phoneNumber,
          },
          { headers }
        );
        console.log(response.data);
        alert("Worker Registered!");
        setFullName("");
        setEmail("");
        setPhoneNumber("");
        setPwd("");
      } catch (error) {
        // console.error("Error:", error);
        console.log(error.response.data);
        if (error.response.data.message === "TOO_LONG") {
          Alert.alert("Error!", "Phone Number Invalid!");
        } else {
          Alert.alert(
            "Error!",
            error?.response?.data?.message ||
              error?.response?.data?.error ||
              "Something went wrong!"
          );
        }
      }
    }
  };
  return (
    <SafeAreaView style={globalStyles.view_screen}>
      <Header />
      <ScrollView nestedScrollEnabled={true}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={globalStyles.text_label_heading}>Add Worker</Text>
        </View>
        <CompanyDropdownPicker
          companyChanged={(companyId) => setSelectedCompany(companyId)}
          setCompanyDetails={(company) => setSelectedCompanyDetails(company)}
        />
        {selectedCompanyError && (
          <Text style={globalStyles.text_label_red}>
            *Company is required.....
          </Text>
        )}
        <Text style={globalStyles.text_label_input}>Full name</Text>
        <TextInput
          style={globalStyles.text_input}
          placeholder={"Olivia Price"}
          value={fullName}
          onChangeText={(e) => setFullName(e)}
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
          placeholder={"OliviaPrice@email.com"}
          value={email}
          onChangeText={(e) => setEmail(e)}
        />
        {emailError && (
          <Text style={globalStyles.text_label_red}>
            *Correct Email is required.....
          </Text>
        )}
        <Text style={globalStyles.text_label_input}>Phone Number</Text>
        {/* <TextInput
          style={globalStyles.text_input}
          keyboardType="phone-pad"
          placeholder={"+52 1234 567 890"}
          value={phoneNumber}
          onChangeText={(e) => setPhoneNumber(e)}
        /> */}
        <PhoneInput
          ref={phoneInputRef}
          defaultValue={phoneNumber}
          defaultCode="MX"
          layout="first"
          containerStyle={{
            backgroundColor: "#fff",
            width: "100%",
            // height: 60,
            marginBottom: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#CFCFCF",
            // paddingHorizontal: 10,
            fontFamily: "EncodeSansRegular",
            fontSize: 16,
            fontWeight: "600",
            // paddingTop: 5,
            marginTop: 2,
          }}
          textContainerStyle={{ backgroundColor: "none", width: "100%" }}
          onChangeFormattedText={(text) => {
            console.log("formatted", text);
            setPhoneNumber(text);
          }}
          // withDarkTheme
          // withShadow
          autoFocus
        />
        {phoneNumberError && (
          <Text style={globalStyles.text_label_red}>
            *Phone Number is required.....
          </Text>
        )}
        <Text style={globalStyles.text_label_input}>Password</Text>
        <TextInput
          style={globalStyles.text_input}
          placeholder={"******"}
          value={pwd}
          onChangeText={(e) => setPwd(e)}
        />
        {pwdError && (
          <Text style={globalStyles.text_label_red}>
            *Password is required and it should be more than 6 characters.....
          </Text>
        )}

        <TouchableOpacity style={globalStyles.btn_01} onPress={onBtnClick}>
          <Text style={globalStyles.text_label_btn01}>Add Worker</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
