import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image
} from "react-native";
import { createDrawerNavigator, DrawerItems } from "react-navigation";
import Home from "../common/home";
import Orders from "../orders/orders";
import CustomerProfile from "../customers/profile";
import Help from "../common/help";
import Settings from '../common/settings'
import Login from '../login/login'

export default class Dashboard extends React.Component {
  render() {
    return <AppDrawerNavigator />;
  }
}

const customDrawComponent = props => (
  <SafeAreaView style={{ flex: 1 }}>
    <View
      style={{
        height: 150,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Image
        source={require("../../assets/customer.png")}
        style={{ height: 120, width: 120, borderRadius: 60 }}
      />
    </View>
    <ScrollView>
      <DrawerItems {...props} />
    </ScrollView>
  </SafeAreaView>
);
const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: Home,
    Order: Orders,
    Transfer: Home,
    Inventory: Orders,
    Profile: {
      screen: CustomerProfile,
      navigationOptions: {
        drawerLabel: () => null
      }
    },
    HelpScreen: {
      screen: Help,
      navigationOptions: {
        drawerLabel: () => null
      }
    },
    SettingsScreen: {
      screen: Settings,
      navigationOptions: {
        drawerLabel: () => null
      }
    },
    // Login: {
    //   screen: Login,
    //   navigationOptions: {
    //     drawerLabel: () => null
    //   }
    // }
  },
  {
    contentComponent: customDrawComponent
  }
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
