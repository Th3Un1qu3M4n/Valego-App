// globalStyles.js

import { StyleSheet, Dimensions } from "react-native";

const globalStyles = StyleSheet.create({
  text_label_heading: {
    fontFamily: "EncodeSansBold",
    fontSize: 24,
    marginBottom: 1,
  },
  text_label_input: {
    fontFamily: "EncodeSansRegular",
    fontSize: 16,
    fontWeight: "600",
    color: "#1c222e",
    marginTop: 5,
  },
  text_label_input_text: {
    fontFamily: "EncodeSansRegular",
    fontSize: 16,
    fontWeight: "600",
    width: "90%",
  },
  
  text_label_btn01: {
    fontFamily: "EncodeSansRegular",
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  text_label_red: {
    fontFamily: "EncodeSansRegular",
    fontSize: 12,
    color: "#FF5050",
    marginTop: 7,
  },
  text_label_card: {
    fontFamily: "EncodeSansRegular",
    fontSize: 12,
    color: "#a0a7b1",
  },
  text_label_card_02_head: {
    fontFamily: "EncodeSansSemiBold",
    fontSize: 15,
    marginTop:5
  },
  text_label_card_02: {
    fontFamily: "EncodeSansRegular",
    fontSize: 14,
  },
  text_label_card_heading: { fontFamily: "EncodeSansSemiBold", fontSize: 16 },
  text_label_setting: {
    fontFamily: "EncodeSansRegular",
    fontSize: 14,
    paddingLeft: 10,
    paddingTop:5
  },

  link_01: {
    fontFamily: "EncodeSansSemiBold",
    fontSize: 16,
    color: "#1a344f",
    marginBottom: 5,
  },

  text_input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    paddingHorizontal: 10,
    fontFamily: "EncodeSansRegular",
    fontSize: 16,
    fontWeight: "600",
    paddingTop: 5,
    marginTop: 2,
  },

  text_input_icon: {},
  text_input_search: {},

  btn_01: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "#1a344f",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  btn_02: {},

  setting_row: {},

  card: {
    width: "97%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    flexDirection: "row",
    margin:5
  },
  card_02: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    flexDirection: "column",
    marginBottom:10
  },

  card_content: {
    paddingHorizontal: 10,
  },

  image_screen: {
    resizeMode:"stretch",
    height: 210,
    width: Dimensions.get("window").width - 40,
    marginBottom:20,
    marginTop:10
  },
  image_card: {},
  image_header: {},

  icon: {},

  view_screen: {
    paddingHorizontal: 20,
    paddingBottom:40
  },
  br_15: {
    marginVertical: 15,
  },
  br_50: {
    marginVertical: 50,
  },
  br_10: {
    marginVertical: 10,
  },
  br_5: {
    marginVertical: 5,
  },
  br_3: {
    marginVertical: 3,
  },
});

export default globalStyles;
