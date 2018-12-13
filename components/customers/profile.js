import React from "react";
import {
  Text,
  View,
  ActivityIndicator,
  AsyncStorage,
  TouchableHighlight
} from "react-native";
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Icon,
  Button,
  Header,
  Body,
  Left,
  Right,
  Title
} from "native-base";
import OptionsMenu from "react-native-options-menu";
import commonStyles from "../styles/styles";
import { custPrflURL } from "../common/url_config";

export default class CustomerProfile extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      customerProfileData: "",
      loading: true,
      distributorId: "",
      authToken: "",
      zipCode: ""
    };
  }
  componentDidMount = async () => {
    this._isMounted = true;
    await AsyncStorage.getItem("LoginDetails")
      // .then(response => response.json())
      .then(responseJson => {
        responseJson = JSON.parse(responseJson);
        // console.log(responseJson.message, responseJson.DistributorID);
        if (this._isMounted) {
          this.setState({
            distributorId: responseJson.DistributorID,
            authToken: responseJson.Token,
            zipCode: responseJson.ZipCode
          });
        }
      });
    if (this._isMounted) this.loadProfileData();
    // console.log(`${custPrflURL}${this.state.distributorId}`);
  };
  componentWillUnmount() {
    this._isMounted = false;
  }
  loadProfileData = () => {
    fetch(`${custPrflURL}${this.state.distributorId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.state.authToken}`
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson);
        this.setState({
          customerProfileData: responseJson
        });
        // console.log(this.state.customerProfileData);
        this.setState({ loading: false });
      })
      .catch(error => {
        //console.error(error);
        this.setState({ loading: false });
      });
  };
  renderLoading() {
    if (this.state.loading) {
      return (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
            // backgroundColor: 'red',
            // opacity: 0.3
          }}
        />
      );
    } else {
      return null;
    }
  }
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
      <Container>
        <View style={{ padding: 10 }} />
        {/* <Button full>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Profile</Text>
        </Button> */}
        <Header style={{ backgroundColor: "#778899" }}>
          <Left style={{ flex: 1 }}>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("Home")}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Profile</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("Home")}
            >
              <Icon name="home" />
            </Button>
            <TouchableHighlight style={{
                borderWidth: 0,
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40
              }}>
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
            </TouchableHighlight>
          </Right>
        </Header>
        <Content>
          <Form>
            <Label style={commonStyles.labelPos}>Designer Id</Label>
            <Item>
              <Text style={{ padding: 10 }}>
                {this.state.customerProfileData.customerIDField}
              </Text>
            </Item>
            <Label style={commonStyles.labelPos}>First Name</Label>
            <Item>
              <Text style={{ padding: 10 }}>
                {this.state.customerProfileData.firstNameField}
              </Text>
            </Item>
            <Label style={commonStyles.labelPos}>Last Name</Label>
            <Item>
              <Text style={{ padding: 10 }}>
                {this.state.customerProfileData.lastNameField}
              </Text>
            </Item>
            <Label style={commonStyles.labelPos}>Phone Number</Label>
            <Item>
              <Text style={{ padding: 10 }}>
                {this.state.customerProfileData.phoneField}
              </Text>
            </Item>
            <Label style={commonStyles.labelPos}>Email</Label>
            <Item>
              <Text style={{ padding: 10 }}>
                {this.state.customerProfileData.emailField}
              </Text>
            </Item>
            <Label style={commonStyles.labelPos}>Zip</Label>
            <Item>
              <Text style={{ padding: 10 }}>{this.state.zipCode}</Text>
            </Item>
            {/* <View style={commonStyles.buttonCommonMargin}>
              <Button block>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Submit</Text>
              </Button>
            </View> */}
            {this.renderLoading()}
          </Form>
        </Content>
      </Container>
    );
  }
}
