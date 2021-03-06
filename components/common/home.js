import React from "react";
import ReactNative, {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  View,
  UIManager,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
  Dimensions,
  AsyncStorage
} from "react-native";
import {
  Container,
  Button,
  Body,
  Header,
  Left,
  Right,
  Icon,
  Title,
  Content,
  Fab
} from "native-base";
import App from "../../App";
import OptionsMenu from "react-native-options-menu";
import commonStyles from "../styles/styles";

const window = Dimensions.get("window");
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
  }
  onOpenMenu = () => {
    UIManager.showPopupMenu(
      ReactNative.findNodeHandle(this._button),
      ["Profile", "Settings", "Help", "Signout"],
      () => console.log("something went wrong with the popup menu"),
      (e, i) => {        
        if (i === 0) {
          this.props.navigation.navigate("Profile");
        } else if (i === 1) {
          this.props.navigation.navigate("SettingsScreen");
        } else if (i === 2) {
          this.props.navigation.navigate("HelpScreen");
        } else if (i === 3) {
          // this.props.navigation.navigate("LoginScreen");         
        } else {          
          // this.props.navigation.navigate("Customer");
        }
      }
    );
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
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Home</Title>
          </Body>
          <Right>
            <TouchableOpacity
              // ref={e => {
              //   this._button = e;
              // }}
              //onPress={this.onOpenMenu}
              // background={TouchableNativeFeedback.Ripple("#f2f2f2")}
              style={{
                borderWidth: 0,
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40
              }}
            >
              {/* <Icon
                name="ellipsis-v"
                type="FontAwesome"
                style={{ fontSize: 30, color: "#55e6f6" }}
              /> */}
              <OptionsMenu
                customButton={
                  <Icon
                    name="ellipsis-v"
                    type="FontAwesome"
                    style={{ fontSize: 30, color: "#f2f2f2" }}
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
            </TouchableOpacity>
            <View style={{ paddingLeft: 10 }} />
          </Right>
        </Header>
        <Content>
          {/* <Image
            source={require("../../assets/logo.png")}
            style={{
              flexDirection: "row",
              marginLeft: 40,
              marginRight: 40,
              marginTop: 20
            }}
          /> */}
          <View
            style={{
              flexDirection: "row",
              margin: 40,
              justifyContent: "space-around"
            }}
          >
            <Image source={require("../../assets/logo.png")} />
          </View>
          <View>
            <View style={styles.container}>
              <View>
                <TouchableHighlight
                  onPress={() => this.props.navigation.navigate("Customer")}
                >
                  {Platform.OS === "ios" ? (
                    <Image
                      source={require("../../assets/customer.png")}
                      style={commonStyles.iosDashboardIcon}
                    />
                  ) : (
                    <Image
                      source={require("../../assets/customer.png")}
                      style={commonStyles.imgDashboardIcon}
                    />
                  )}
                </TouchableHighlight>
                <Text>Customer</Text>
              </View>
              <View>
                <TouchableHighlight
                  onPress={() => this.props.navigation.navigate("Inventory")}
                >
                  {Platform.OS === "ios" ? (
                    <Image
                      source={require("../../assets/inventory.png")}
                      style={commonStyles.iosDashboardIcon}
                    />
                  ) : (
                    <Image
                      source={require("../../assets/inventory.png")}
                      style={commonStyles.imgDashboardIcon}
                    />
                  )}
                </TouchableHighlight>
                <Text>Inventory</Text>
              </View>
              <View>
                <TouchableHighlight
                  onPress={() => this.props.navigation.navigate("Order")}
                >
                  {Platform.OS === "ios" ? (
                    <Image
                      source={require("../../assets/orders.png")}
                      style={commonStyles.iosDashboardIcon}
                    />
                  ) : (
                    <Image
                      source={require("../../assets/orders.png")}
                      style={commonStyles.imgDashboardIcon}
                    />
                  )}
                </TouchableHighlight>
                <Text>Order</Text>
              </View>
            </View>
            <View
              style={{
                // flex: 1,
                // flexDirection: "row",
                // marginLeft: 40,
                // marginTop: 5,
                // justifyContent: 'space-between'
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-around"
              }}
            >
              <View>
                <TouchableHighlight
                  onPress={() => this.props.navigation.navigate("CustomerTransactionScreen")}
                >
                  {Platform.OS === "ios" ? (
                    <Image
                      source={require("../../assets/transaction.png")}
                      style={commonStyles.iosDashboardIcon}
                    />
                  ) : (
                    <Image
                      source={require("../../assets/transaction.png")}
                      style={commonStyles.imgDashboardIcon}
                    />
                  )}
                </TouchableHighlight>
                <Text>C & T Fee</Text>
              </View>
              <View>
                <TouchableHighlight
                  onPress={() =>
                    this.props.navigation.navigate("Designer to Designer")
                  }
                >
                  {Platform.OS === "ios" ? (
                    <Image
                      source={require("../../assets/transfer.png")}
                      style={commonStyles.iosDashboardIcon}
                    />
                  ) : (
                    <Image
                      source={require("../../assets/transfer.png")}
                      style={commonStyles.imgDashboardIcon}
                    />
                  )}
                </TouchableHighlight>
                <Text>Designer To Designer</Text>
              </View>
              <View />
            </View>
          </View>
        </Content>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{}}
            style={{
              backgroundColor: "#4d4d4d",
              position: "absolute",
              right: 0,
              bottom: 0
            }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}
          >
            <ImageBackground
              resizeMode={"stretch"} // or cover
              style={{
                height: "100%",
                width: "100%"
              }}
              source={require("../../assets/start.png")}
            />

            {/* <Icon name="sun-o" type="FontAwesome" /> */}
            <Button
              style={{ backgroundColor: "#34A34F" }}
              onPress={() =>
                this.props.navigation.navigate("Designer to Designer")
              }
            >
              {/* <Icon name="logo-whatsapp" /> */}
              <Image
                source={require("../../assets/transfer.png")}
                style={commonStyles.fabIcon}
              />
            </Button>
            <Button
              style={{ backgroundColor: "#3B5998" }}
              onPress={() => this.props.navigation.navigate("InventoryOrder")}
            >
              <Image
                source={require("../../assets/cart.png")}
                style={commonStyles.fabIcon}
              />
            </Button>
            <Button
              style={{ backgroundColor: "#DD5144" }}
              onPress={() => this.props.navigation.navigate("AddCutsomer")}
            >
              <Image
                source={require("../../assets/new_customer.png")}
                style={commonStyles.fabIcon}
              />
            </Button>
          </Fab>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    //margin: 20
    marginTop: 15
  }
});
