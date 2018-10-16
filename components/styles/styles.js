import { StyleSheet } from "react-native";

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
  }
});

export default commonStyles;
