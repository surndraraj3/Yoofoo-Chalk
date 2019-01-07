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
//--------------Increme Count----------
// res.map(c => {
    //   //console.log("-----", c.incVal, qty);
    //   const incremntVal = c.incVal + 1;
    //   if (incremntVal > qty) {
    //     alert("Max Quantity Reached");
    //   } else {
    //     //console.log("Lesser Val");
    //     c.incVal = c.incVal + 1;
    //     c.Quantity = c.Quantity - 1;
    //     this.setState({ orderItemCounter: this.state.orderItemCounter + 1 });
    //     // res.map(
    //     //   v => ((v.incVal = v.incVal + 1), (v.Quantity = v.Quantity - 1))
    //     // );
    //     // res.incVal = this.setState({
    //     //   orderItemCounter: this.state.orderItemCounter + 1
    //     // });
    //     //this.state.inventoryList.push(res);
    //   }
    // });
//-----------------------Dec count
// res.map(resp => {
    //   // console.log("-----", resp.incVal, decQty);
    //   const decrementVal = resp.incVal - 1;
    //   // console.log("decrementVal", decrementVal);
    //   if (decrementVal < 0) {
    //     alert(`Can't decrement value`);
    //   } else {
    //     resp.incVal = resp.incVal - 1;
    //     resp.Quantity = resp.Quantity + 1;
    //     this.setState({ orderItemCounter: this.state.orderItemCounter - 1 });
    //     // res.map(
    //     //   v => ((v.incVal = v.incVal - 1), (v.Quantity = v.Quantity + 1))
    //     // );
    //     // res.incVal = this.setState({
    //     //   orderItemCounter: this.state.orderItemCounter - 1
    //     // });
    //     //this.state.inventoryList.push(res);
    //   }
    // });
//--------------- Cart Items----------------
// checkedItem.map(chkValItm => {
    //   if (chkValItm.incVal === 0)
    //     alert("Add the item quantity before selecting item");
    //   else {
    //     if (!chkValItm.selectItem) chkValItm.selectItem = true;
    //     else chkValItm.selectItem = false;
    //   }
    // });
    // checkedItem.selectItem = this.setState({ checked: true });
    // this.state.inventoryList.push(checkedItem);