import React from "react";
import { AsyncStorage, TouchableHighlight } from "react-native";
import { Icon } from "native-base";
import OptionsMenu from "react-native-options-menu";

export default class EllipsisMenuOption extends React.Component {
  constructor(props) {
    super(props);
  }
  // gotoProfile = ({navigation}) => {
  //     navigation.navigate("Profile");
  //   };
  //Go to Profile Screen
  gotoProfile = () => {
    this.props.navigation.navigate("Profile");
  };
  //Go To Settings
  goToSettings = () => {
    this.props.navigation.navigate("SettingsScreen");
  };
  //Go To Help
  goToHelp = () => {
    this.props.navigation.navigate("HelpScreen");
  };
  goToSignout = () => {
    AsyncStorage.removeItem("LoginDetails");
    this.props.navigation.navigate("Login");
  };
  render() {
    return (
      <OptionsMenu
        customButton={
          <Icon
            name="ellipsis-v"
            type="FontAwesome"
            style={{ color: "#f2f2f2" }}
          />
        }
        destructiveIndex={1}
        options={["Profile", "Settings", "Help", "Signout"]}
        actions={[
            this.gotoProfile,
            this.goToSettings,
            this.goToHelp,
            this.goToSignout
        ]}
      />
    );
  }
}