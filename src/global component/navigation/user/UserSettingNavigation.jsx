import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import User_setting from '../../../screen/users/home/04_setting/setting';

const Stack = createNativeStackNavigator();

function UserSettingNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="user_setting" component={User_setting} />
    </Stack.Navigator>
  )
}

export default UserSettingNavigation