import React from "react";
import { createStackNavigator } from "react-navigation";
import Dashboard from "../dashboard/dashboard";
import Login from "../login/login";
import Home from "../common/home";
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
    Home: { screen: Home },
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
