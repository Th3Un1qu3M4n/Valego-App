import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Worker_setting from '../../../screen/worker/home/05_setting/setting';

const Stack = createNativeStackNavigator();


function WorkerSettingNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="worker_dashboard" component={Worker_setting} />
    </Stack.Navigator>
  )
}

export default WorkerSettingNavigation