import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import landingPage from '../../../screen/global/landingPage';
import Contactus from '../../../screen/global/contactus';
import User_phone_num_login from '../../../screen/users/login/01_phone_num/phone_num_login';
import User_otp from '../../../screen/users/login/02_otp/otp';
import Worker_login from '../../../screen/worker/01_login/worker_login';

const Stack = createNativeStackNavigator();

function UserAuthNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="welcome" component={landingPage} /> */}
      <Stack.Screen name="user_login" component={User_phone_num_login} />

      <Stack.Screen name="contactus" component={Contactus} />
      <Stack.Screen name="user_otp" component={User_otp} />
      {/* <Stack.Screen name="user_home" component={UserTabNavigation} /> */}
      <Stack.Screen name="worker_login" component={Worker_login} />
    </Stack.Navigator>
  )
}

export default UserAuthNavigation