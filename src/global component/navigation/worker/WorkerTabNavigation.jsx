import React from 'react'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WorkerHomeNavigation from './WorkerHomeNavigation';
import WorkerSettingNavigation from './WorkerSettingNavigation';
import { Image, View } from "react-native";

const Tab = createBottomTabNavigator();

function WorkerTabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarBadgeStyle: {
          backgroundColor: "red",
        },
      }}
    >
      <Tab.Screen
        name="worker_home"
        component={WorkerHomeNavigation}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Image
                resizeMode="contain"
                style={{
                  width: size,
                  height: size,
                }}
                source={
                  focused
                    ? require("../../../../assets/icons/shome.png")
                    : require("../../../../assets/icons/home.png")
                }
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="worker_setting"
        component={WorkerSettingNavigation}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Image
                resizeMode="contain"
                style={{
                  width: size,
                  height: size,
                }}
                source={
                  focused
                    ? require("../../../../assets/icons/ssetting.png")
                    : require("../../../../assets/icons/setting.png")
                }
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default WorkerTabNavigation