import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import User_info from "../../../screen/users/home/03_info/info";
import User_qrcode_scanner from "../../../screen/users/home/05_qrcode_scanner01/qrcode_scanner";
import User_vehicle_pick from "../../../screen/users/home/06_vehicle_pick/vehicle_pick";
import User_payment from "../../../screen/users/home/07_payment/payment";
import User_in_process from "../../../screen/users/home/08_in_process/in_process";
import User_waiting from "../../../screen/users/home/09_waiting/waiting";
import { MyContext } from "../../../../context/tokenContext";
import UserPaymentNavigation from "./UserPaymentNavigation";
const Stack = createNativeStackNavigator();

function UserHomeNavigation() {
  const { isUserReg, request } = useContext(MyContext);
  console.log("request", request);
  console.log("isUserReg", isUserReg);

  // ["Pending", "Accepted", "CarRequested", "CarReady", "Delivered"],

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isUserReg && <Stack.Screen name="user_info" component={User_info} />}
      {!request && isUserReg && (
        <Stack.Screen
          name="user_qrcode_scanner"
          component={User_qrcode_scanner}
        />
      )}
      {request && request.status === "Accepted" && (
        <Stack.Screen
          name="user_vehicle_pick"
          component={UserPaymentNavigation}
        />
      )}
      {request && request.status === "CarRequested" && (
        <Stack.Screen name="user_in_process" component={User_in_process} />
      )}
      {/* <Stack.Screen name="user_payment" component={User_payment} /> */}
      {/* <Stack.Screen name="user_in_process" component={User_in_process} /> */}

      {request && request.status === "CarReady" && (
        <Stack.Screen name="user_waiting" component={User_waiting} />
      )}
    </Stack.Navigator>
  );
}

export default UserHomeNavigation;
