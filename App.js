import React from "react";
import Expo from "expo";
import Login from "./components/login/login";
import Routes from "./components/shared/routes";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ loading: false });
  }

  render() {
    console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return <Routes />;
  }
}
