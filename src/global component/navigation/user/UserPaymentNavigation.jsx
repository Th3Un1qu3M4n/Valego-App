import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import User_vehicle_pick from "../../../screen/users/home/06_vehicle_pick/vehicle_pick";
import User_payment from "../../../screen/users/home/07_payment/payment";
const Stack = createNativeStackNavigator();

function UserPaymentNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="user_vehicle_pick" component={User_vehicle_pick} />
      <Stack.Screen name="user_payment" component={User_payment} />
    </Stack.Navigator>
  );
}

export default UserPaymentNavigation;
