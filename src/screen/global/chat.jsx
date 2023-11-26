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

export function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const { user, request } = useContext(MyContext);
  const db = getFirestore(app);

  useEffect(() => {
    try {
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
      } catch (error) {
        console.log(error);
      }
      // Use set to add data to the document
    },
    [request?._id, db]
  );

  return (
    <>
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
