import React from "react";
import { View, Dimensions, AsyncStorage, Keyboard, TouchableHighlight } from "react-native";
import {
  Container,
  Content,
  Text,
  Icon,
  Label,
  Header,
  Body,
  Button,
  Input,
  Left,
  Right,
  Title,
  Card,
  CardItem
} from "native-base";
import Toast from "react-native-simple-toast";
import OptionsMenu from "react-native-options-menu";
import { zipCodeUrl } from "../common/url_config";
import commonStyles from "../styles/styles";

const deviceWidth = Dimensions.get("window").width;
export default class Settings extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      errorZipCode: false,
      distributorId: "",
      authToken: "",
      txtZipCode: 0,
      distributorZipCode: "",
      clearInput: false
    };
  }
  componentDidMount() {
    this._isMounted = true;
    this.loadDistributorDtls();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  //Get Distributor ID from login response
  loadDistributorDtls = async () => {
    //console.log("Welcome to load login details");
    await AsyncStorage.getItem("LoginDetails").then(responseJson => {
      responseJson = JSON.parse(responseJson);
      if (this._isMounted) {
        this.setState({
          distributorId: responseJson.DistributorID,
          authToken: responseJson.Token,
          distributorZipCode: responseJson.ZipCode
        });
      }
    });
  };
  handleZipCode = valZipCode => {
    //console.log('valZipCode', valZipCode);
    this.setState({ distributorZipCode: valZipCode });
  };
  //Validate Zip Code
  validateZipCode = () => {
    console.log("Welcome Zip", `${zipCodeUrl}${this.state.distributorZipCode}/${this.state.distributorId}`);
    if (this.state.distributorZipCode !== 0) {
      fetch(`${zipCodeUrl}${this.state.distributorZipCode}/${this.state.distributorId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.state.authToken}`
        }
      })
        .then(zipCodeResponse => zipCodeResponse.json())
        .then(zipCodeResponseJson => {
          // console.log("Zip Validation", zipCodeResponseJson.ZipCode.Zip5);
          {
            zipCodeResponseJson.ZipCode.Zip5 === null
              ? Toast.showWithGravity(
                  "Invalid Zip code",
                  Toast.SHORT,
                  Toast.CENTER
                )
              : this.props.navigation.navigate("Home");
          }
        })
        .catch(errZipValidation => {
          throw errZipValidation;
        });
    } else {
      Toast.showWithGravity("Enter Zip Code", Toast.SHORT, Toast.CENTER);
    }
  };
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
        <Header style={{ backgroundColor: "#778899" }}>
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={this.validateZipCode}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Settings</Title>
          </Body>
          <Right>
            <Button transparent onPress={this.validateZipCode}>
              <Icon name="home" />
            </Button>
            {/* <Button transparent>
              <Icon name="more" />
            </Button> */}
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
        <Content padder>
          <Card>
            <CardItem header bordered>
              <Text>Settings</Text>
            </CardItem>
            <CardItem>
              <Left>
                <Label>Build Number</Label>
              </Left>
              <Right>
                <Text>12/13/2018</Text>
              </Right>
            </CardItem>
            <CardItem>
              <Left>
                <Label>Default Zip</Label>
              </Left>
              <Right>
                <Input
                  placeholder=""
                  onChangeText={this.handleZipCode}
                  keyboardType="numeric"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                  value = {this.state.distributorZipCode}
                />
              </Right>
              {/* <Right><Input placeholder="84106" onChangeText={this.handleZipCode} /></Right>  */}
            </CardItem>
            {this.state.errorZipCode && (
              <Label style={commonStyles.errorMsg}>Incorrect Zip Code</Label>
            )}
          </Card>
        </Content>
      </Container>
    );
  }
}
