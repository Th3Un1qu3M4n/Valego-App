import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Admin_dashboard from "../../../screen/worker/admin/dashboard/admin_dashboard";
import Admin_all_workers from "../../../screen/worker/admin/all_workers/admin_all_workers";
import Admin_add_worker from "../../../screen/worker/admin/add_worker/admin_add_worker";
import Admin_add_company from "../../../screen/worker/admin/add_company/admin_add_company";

const Stack = createNativeStackNavigator();

function AdminHomeNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="admin_dashboard" component={Admin_dashboard} />
      <Stack.Screen name="admin_all_worker" component={Admin_all_workers} />
      <Stack.Screen name="admin_add_worker" component={Admin_add_worker} />
      <Stack.Screen name="admin_add_company" component={Admin_add_company} />
    </Stack.Navigator>
  );
}

export default AdminHomeNavigation;
