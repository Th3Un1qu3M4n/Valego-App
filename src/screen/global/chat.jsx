import React, { useState, useCallback, useEffect, useContext } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import app from "../../../config/firebaseConfig"; // Adjust the import path
import { MyContext } from "../../../context/tokenContext";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";
import { Alert, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth } from "firebase/auth";
import axios from "axios";

export function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const auth = getAuth();
  const { user, request, userLoggedInType, API_URL } = useContext(MyContext);
  const db = getFirestore(app);

  console.log("User IS ", userLoggedInType);
  console.log("worker Token IS ", request?.workerId?.pushToken);
  console.log("user token IS ", request?.userId?.pushToken);

  const sendMessage = async (message) => {
    console.log("message", message);
    try {
      const token = await auth.currentUser.getIdToken(true);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      let pushToken;
      if (userLoggedInType == "Customer") {
        pushToken = request?.workerId?.pushToken;
      } else {
        pushToken = request?.userId?.pushToken;
      }

      const response = await axios.post(
        `${API_URL}/api/notification/send/`,
        {
          pushToken: pushToken,
          messageData: message,
        },
        {
          headers,
        }
      );
      console.log(response.data);
      // setRequest(null);
      // navigation.navigate("worker_dashboard", {});
    } catch (error) {
      console.log(error?.response?.data?.error || error?.message || error);
      Alert.alert(
        "Error",
        error?.response?.data?.error || error?.message || error
      );
    }
  };

  useEffect(() => {
    try {
      console.log("wherer", request?._id);
      const q = query(
        collection(db, "chats"),
        where("requestId", "==", request?._id),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({
            _id: doc.id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
          }))
        );
      });
      return () => unsubscribe();
    } catch (error) {
      console.log(error);
      console.log("request", request?._id, "navigating to worker_home");
      // navigation.navigate("worker_home");
    }
  }, [navigation, request?._id, db]);

  const onSend = useCallback(
    async (messages = []) => {
      const { _id, createdAt, text, user } = messages[0];
      const chatRef = collection(db, "chats");

      // Create a new document reference
      try {
        const newChatDoc = doc(chatRef);
        console.log("user", user);
        await setDoc(newChatDoc, {
          _id,
          createdAt,
          text,
          user,
          requestId: request?._id,
        });
        sendMessage(text);
      } catch (error) {
        console.log(error);
      }
      // Use set to add data to the document
    },
    [request?._id, db]
  );

  return (
    <>
      <SafeAreaView>
        <TouchableOpacity
          style={{
            padding: 20,
            backgroundColor: "#1a344f",
            // textColor: "#ff",
          }}
          onPress={() => {
            navigation.pop();
          }}
        >
          <Text style={{ color: "white" }}>BACK</Text>
        </TouchableOpacity>
      </SafeAreaView>
      {request && (
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: user.id,
            name: user.name,
          }}
          renderUsernameOnMessage={true}
          bottomOffset={30}
          alwaysShowSend={true}
        />
      )}
    </>
  );
}
