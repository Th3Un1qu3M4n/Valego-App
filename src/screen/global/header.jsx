import React, { useContext } from "react";
import { Text, View, Image, TouchableOpacity,StyleSheet } from "react-native"; // Import TouchableOpacity for the button
import { getAuth, signOut } from "firebase/auth";
import { MyContext } from "../../../context/tokenContext";
function Header(props) {
  const { user,request, setRequest,userLoggedInType } = useContext(MyContext);

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
      {!(userLoggedInType=="Customer") && user && request&& (
        <TouchableOpacity
          style={{
            position: "absolute",
            left: 0,
            paddingHorizontal: 5,
            paddingVertical: 7,
            borderRadius: 7,
          }}
          onPress={()=>setRequest(null)}
        >
           <Image
              source={require("../../../assets/icons/back.png")} // Replace with your actual icon path
              style={styles.icon}
            />
        </TouchableOpacity>
      )}
      <Image
        resizeMode="contain"
        style={{
          width: 40,
          height: 40,
        }}
        source={require("../../../assets/images/v1.png")}
      />
       {!(userLoggedInType=="Customer") && user && (
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 0,
            paddingHorizontal: 5,
            paddingVertical: 7,
            borderRadius: 7,
          }}
          onPress={signout}
        >
           <Image
              source={require("../../../assets/icons/logout.png")} // Replace with your actual icon path
              style={styles.icon}
            />
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  
  icon: {
    width: 22, // Set the width of your icon
    height: 22, // Set the height of your icon
    resizeMode: "contain",
  },
  
});
export default Header;
