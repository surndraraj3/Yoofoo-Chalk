import { StyleSheet, Dimensions } from "react-native";

const window = Dimensions.get("window");

export const IMAGE_HEIGHT = window.width / 2;
export const IMAGE_HEIGHT_SMALL = window.width / 7;

const commonStyles = StyleSheet.create({
  buttonPos: {
    alignItems: "flex-end",
    margin: 20
  },
  labelPos: {
    marginLeft: 15,
    marginTop: 15
  },
  buttonCommonMargin: {
    margin: 30
  },
  forgotPass: {
    textAlign: "center",
    margin: 20,
    color: "#e60000"
  },
  logoStyles: {
    color: "#42f4f1",
    fontSize: 30,
    textAlign: "center",
    marginTop: 40
  },
  errorMsg: {
    margin: 10,
    color: "#e60000",
    textAlign: "center"
  },
  imgDashboardIcon: {
    height: 60,
    width: 60,
    borderRadius: 60
  },
  rowData: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  row: {
    margin: 15,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  nestedRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  column: {
    flexDirection: "column",
    justifyContent: "flex-start",
    flex: 4
  },
  iconCircle: {
    borderWidth: 1,
    borderColor: "#55e6f6",
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
    backgroundColor: "#fff",
    borderRadius: 100
  },
  addBottomIconRow: {
    flex: 1,
    justifyContent: "flex-end"
  },
  // alignEndIcon: {
  //   alignSelf: "flex-end",
  //   // color: "#841584"
  // },
  fixed: {
    position: "absolute",
    right: 0,
    bottom: 0
  },
  alignEndIcon: {
    alignSelf: "flex-end",
    flex: 1
    // color: "#841584"
  },
  fabIcon: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2
  },
  warningMessage: {
    color: "#e60000",
    textAlign: "center"
  },
  ellipseCircle: {
    borderWidth: 1,
    borderColor: "#55e6f6",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 100
  },
  container: {
    backgroundColor: "#4c69a5",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 5,
    // paddingVertical: 5,
    // paddingHorizontal: 15,
    width: window.width - 30
  },
  logo: {
    height: IMAGE_HEIGHT,
    resizeMode: "contain",
    marginBottom: 20,
    padding: 10,
    marginTop: 20
  },
  register: {
    marginBottom: 20,
    width: window.width - 100,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    backgroundColor: "#ffae"
  },
  setMargin: {
    margin: 10
  }
});

export default commonStyles;
