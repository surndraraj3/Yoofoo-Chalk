import React from "react";
import { createStackNavigator } from "react-navigation";
import Dashboard from "../dashboard/dashboard";
import Login from "../login/login";
import Customers from "../customers/customers";
import Orders from "../orders/orders";
import ResetPassword from "../customers/reset_password";

const Routes = createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: {
        headerLeft: null,
        header: null
      }
    },
    Dashboard: {
      screen: Dashboard,
      navigationOptions: {
        header: null
      }
    },
    Customer: { screen: Customers },
    OrdersScreen: { screen: Orders },
    ResetCustomerDetails: {
      screen: ResetPassword,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: "Login"
  }
);

export default Routes;
//   AppRegistry.registerComponent('SimpleApp', () => SimpleApp);
