import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Worker_login from '../../../screen/worker/01_login/worker_login';
import UserAuthNavigation from '../user/UserAuthNavigation';
import WorkerHomeNavigation from './WorkerHomeNavigation';
import Contactus from '../../../screen/global/contactus';
import WorkerTabNavigation from './WorkerTabNavigation';
import AdminHomeNavigation from '../admin/AdminHomeNavigation';

const Stack = createNativeStackNavigator();

function WorkerAuthNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="worker_login" component={Worker_login} />
      <Stack.Screen name="contactus" component={Contactus} />
      <Stack.Screen name="user_login" component={UserAuthNavigation} />
      <Stack.Screen name="worker_home" component={WorkerTabNavigation} /> 
      <Stack.Screen name="admin_home" component={AdminHomeNavigation} /> */}
      
    </Stack.Navigator>
  )
}

export default WorkerAuthNavigation