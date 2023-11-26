import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Workerdashboard from "../../../screen/worker/home/02_dashboard/dashboard";
import Worker_vehicle_requested from "../../../screen/worker/home/03_vehicle_requested/vehicle_requested";
import Worker_vehicle_ready from "../../../screen/worker/home/04_vehicle_ready/vehicle_ready";
import { MyContext } from "../../../../context/tokenContext";
import { ChatScreen } from "../../../screen/global/chat";

const Stack = createNativeStackNavigator();

function WorkerHomeNavigation() {
  const { request } = useContext(MyContext);
  // ["Pending", "Accepted", "CarRequested", "CarReady", "Delivered"],
  console.log(request);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!request && (
        <Stack.Screen name="worker_dashboard" component={Workerdashboard} />
      )}
      {request &&
        (request.status === "Accepted" ||
          request.status === "CarRequested") && (
          <Stack.Screen
            name="worker_vehicle_requested"
            component={Worker_vehicle_requested}
          />
        )}
      {request && request.status === "CarReady" && (
        <Stack.Screen
          name="worker_vehicle_ready"
          component={Worker_vehicle_ready}
        />
      )}
      {request && <Stack.Screen name="chat" component={ChatScreen} />}
    </Stack.Navigator>
  );
}

export default WorkerHomeNavigation;
