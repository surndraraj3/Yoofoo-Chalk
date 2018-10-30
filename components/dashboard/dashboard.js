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
import Settings from "../common/settings";
import Inventory from "../inventory/inventory";
import InventoryOrder from "../inventory/inventory-order";
import Customers from "../customers/customers";
import Transfer from "../transfer/transfer";
import ResendInvoice from "../orders/resend-invoice";
import AddCutsomer from "../customers/add_customer";
import Checkout from "../transfer/checkout";

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
    Transfer: Transfer,
    Inventory: Inventory,
    InventoryOrder: {
      screen: InventoryOrder,
      navigationOptions: {
        drawerLabel: () => null
      }
    },
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
    Customer: {
      screen: Customers,
      navigationOptions: {
        drawerLabel: () => null
      }
    },
    ResendInvoice: {
      screen: ResendInvoice,
      navigationOptions: {
        drawerLabel: () => null
      }
    },
    AddCutsomer: {
      screen: AddCutsomer,
      navigationOptions: {
        drawerLabel: () => null
      }
    },
    Checkout: {
      screen: Checkout,
      navigationOptions: {
        drawerLabel: () => null
      }
    }
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
