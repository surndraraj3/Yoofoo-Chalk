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
import { createDrawerNavigator, DrawerItems, DrawerNavigator } from "react-navigation";
import Login from '../login/login';
import Home from "../common/home";
import Orders from "../orders/orders";
import CustomerProfile from "../customers/profile";
import Help from "../common/help";
import Settings from "../common/settings";
import Inventory from "../inventory/inventory";
import InventoryOrder from "../inventory/inventory-order";
import InventoryOrderDiscount from '../inventory/inventory-discount';
import AddInventoryOrder from '../inventory/add-order';
import Customers from "../customers/customers";
import Transfer from "../transfer/transfer";
import ResendInvoice from "../orders/resend-invoice";
import AddCutsomer from "../customers/add_customer";
import Checkout from "../transfer/checkout";
import DesignerInventory from "../transfer/designer-inventory";

export default class Dashboard extends React.Component {
  render() {
    return <AppDrawerNavigator />;
  }
}

const customDrawComponent = props => (
  <SafeAreaView style={{ flex: 1 }}>
    <View
      style={{
        height: 50,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Image       
        style={{ height: 20, width: 50, borderRadius: 60 }}
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
    "Designer to Designer": Transfer,    
    Inventory: Inventory,
    InventoryOrder: {
      screen: InventoryOrder,
      navigationOptions: {
        drawerLabel: () => null
      }
    },
    InventoryOrderDiscount: {
      screen: InventoryOrderDiscount,
      navigationOptions: {
        drawerLabel: () => null
      }
    },
    AddInventoryOrder: {
      screen: AddInventoryOrder,
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
      screen: Customers      
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
    Dashboard: {
      screen: Dashboard,
      navigationOptions: {
        drawerLabel: () => null
      }
    },
    Checkout: {
      screen: Checkout,
      navigationOptions: {
        drawerLabel: () => null
      }
    },
    Login: {
      screen: Login,
      navigationOptions: {
        drawerLabel: () => null
      }
    },
    DesignerInventory: {
      screen: DesignerInventory,
      navigationOptions: {
        drawerLabel: () => null
      }
    }
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
