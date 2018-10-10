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
import Customers from "../customers/customers";
import Orders from "../orders/orders";
import CustomerProfile from "../customers/profile";

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
    Customer: Customers,
    Order: Orders,
    Transfer: Customers,
    Inventory: Orders,
    // Profile: CustomerProfile,
    Profile: {
      screen: CustomerProfile,
      navigationOptions: {
        drawerLabel: ()=>null,
      }}
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
