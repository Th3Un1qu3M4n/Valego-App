import React, { useContext } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native"; // Import TouchableOpacity for the button
import { getAuth, signOut } from "firebase/auth";
import { MyContext } from "../../../context/tokenContext";
function Header() {
  const { user, setRequest } = useContext(MyContext);

  const auth = getAuth();

  const signout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
        setRequest(null);
        // You can add additional logic here after signout
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 15,
        paddingBottom: 15,
      }}
    >
      <Image
        resizeMode="contain"
        style={{
          width: 40,
          height: 40,
        }}
        source={require("../../../assets/images/v1.png")}
      />
      {user && (
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 0,
            backgroundColor: "#fff",
            paddingHorizontal: 15,
            paddingVertical: 7,
            borderRadius: 7,
          }}
          onPress={signout}
        >
          <Text>Sign out</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default Header;
