import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Link } from "@react-navigation/native";
import Header from "../../global/header";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "../../global/globalStyles";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function Worker_login({ navigation }) {
  const [valetUser, setValetUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [hidePwd, setHidePwd] = useState(true);
  const [loader, setLoader] = useState(false);

  const onBtnClick = () => {
    // navigation.navigate("worker_home", {});
    // navigation.navigate("admin_home", {});

    handleLogin({
      email: valetUser, // Replace with your email
      password: pwd, // Replace with your password
    });
  };

  const handleLogin = async ({ email, password }) => {
    try {
      setLoader(true);

      const auth = getAuth();
      console.log(email, password);
      console.log(valetUser, pwd);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setLoader(false);

      console.log("user", user);
    } catch (error) {
      setLoader(false);

      Alert.alert("Error", "Invalid Email or Password");
    }
  };
  return (
    <SafeAreaView style={globalStyles.view_screen}>
      <Header />
      <View>
        <Text style={globalStyles.text_label_input}>Valet Email</Text>
        <TextInput
          style={globalStyles.text_input}
          value={valetUser}
          onChangeText={(e) => setValetUser(e)}
          placeholder={"OCHO30SanAndres"}
        />
        <Text style={globalStyles.text_label_input}>Password</Text>

        <View style={[globalStyles.text_input, styles.row]}>
          <TextInput
            style={globalStyles.text_label_input_text}
            autoCorrect={false}
            secureTextEntry={hidePwd}
            value={pwd}
            onChangeText={(e) => setPwd(e)}
            placeholder="******"
          />
          <TouchableOpacity onPress={() => setHidePwd(!hidePwd)}>
            <Image
              source={
                hidePwd
                  ? require("../../../../assets/icons/es.png")
                  : require("../../../../assets/icons/eh.png")
              } // Replace with your actual icon path
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

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
        <Link
          style={globalStyles.link_01}
          to={{ screen: "user_login", params: {} }}
        >
          Sign in as User
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
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 24, // Set the width of your icon
    height: 24, // Set the height of your icon
    marginRight: 8, // Adjust margin as needed
    resizeMode: "contain",
  },
  textInput: {
    padding: 8, // Adjust padding as needed
    borderColor: "gray",
    borderWidth: 1,
    flex: 1, // Take remaining space in the row
  },
});

export default Worker_login;
