import React from 'react'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserHomeNavigation from './UserHomeNavigation';
import UserSettingNavigation from './UserSettingNavigation';
import { Image, View } from "react-native";

const Tab = createBottomTabNavigator();

function UserTabNavigation(props) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarBadgeStyle: {
          backgroundColor: "red",
        },
      }}
    >
      <Tab.Screen
        name="User_home"
        component={UserHomeNavigation}
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
        name="user_setting"
        component={UserSettingNavigation}
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

export default UserTabNavigation