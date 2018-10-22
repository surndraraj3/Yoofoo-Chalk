import React from "react";
import ReactNative, {
  StyleSheet,
  Text,
  Image,
  ScrollView,
  View,
  UIManager,
  TouchableNativeFeedback,
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
import commonStyles from "../styles/styles";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "true"
    };
  } 
  onOpenMenu = () => {
    UIManager.showPopupMenu(
      ReactNative.findNodeHandle(this._button),
      ["Profile", "Settings", "Help", "Signout"],
      () => console.log("something went wrong with the popup menu"),
      (e, i) => {
        // console.log(`${e} : ${i}`);
        if (i === 0) {
          this.props.navigation.navigate("Profile");
        } else if (i === 1) {
          this.props.navigation.navigate("SettingsScreen");
        } else if (i === 2) {
          this.props.navigation.navigate("HelpScreen");
        } else if (i === 3) {
          // this.props.navigation.navigate("LoginScreen");
          console.log(`${e} : ${i}`);
        } else {
          console.log(`${e} : ${i}`);
          // this.props.navigation.navigate("Customer");
        }
      }
    );
  };
  render() {
    return (
      <Container>
        <View style={{ padding: 10 }} />
        <Header>
          <Left>
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
            <TouchableNativeFeedback
              ref={e => {
                this._button = e;
              }}
              onPress={this.onOpenMenu}
              background={TouchableNativeFeedback.Ripple("#f2f2f2")}
            >
              <Icon name="more" />
            </TouchableNativeFeedback>
            <View style={{ paddingLeft: 30 }} />
          </Right>
        </Header>
        <Content>
          <ScrollView>
            <View style={styles.container}>
              <View>
                <TouchableNativeFeedback
                  onPress={() => this.props.navigation.navigate("Customer")}
                >
                  <Image
                    source={require("../../assets/customer.png")}
                    style={commonStyles.imgDashboardIcon}
                  />
                </TouchableNativeFeedback>
                <Text>Customer</Text>
              </View>
              <View>
                <TouchableNativeFeedback
                  onPress={() => this.props.navigation.navigate("Inventory")}
                >
                  <Image
                    source={require("../../assets/inventory.png")}
                    style={commonStyles.imgDashboardIcon}
                  />
                </TouchableNativeFeedback>
                <Text>Inventory</Text>
              </View>
              <View>
                {/* <TouchableNativeFeedback
                  onPress={() => this.props.navigation.navigate("Transfer")}
                >
                  <Image
                    source={require("../../assets/transfer.png")}
                    style={commonStyles.imgDashboardIcon}
                  />
                </TouchableNativeFeedback>
                <Text>Transfer</Text> */}
                <TouchableNativeFeedback
                  onPress={() => this.props.navigation.navigate("Order")}
                >
                  <Image
                    source={require("../../assets/orders.png")}
                    style={commonStyles.imgDashboardIcon}
                  />
                </TouchableNativeFeedback>
                <Text>Order</Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: "row", marginLeft: 50 }}>
              <View>
                <TouchableNativeFeedback
                  onPress={() => this.props.navigation.navigate("Checkout")}
                >
                  <Image
                    source={require("../../assets/transaction.png")}
                    style={commonStyles.imgDashboardIcon}
                  />
                </TouchableNativeFeedback>
                <Text>C & T Fee</Text>
              </View>
            </View>
          </ScrollView>
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
            <Icon name="sun-o" type="FontAwesome" />
            <Button style={{ backgroundColor: "#34A34F" }}>
              {/* <Icon name="logo-whatsapp" /> */}
              <Image
                source={require("../../assets/transfer.png")}
                style={commonStyles.fabIcon}
              />
            </Button>
            <Button style={{ backgroundColor: "#3B5998" }}>
              <Image
                source={require("../../assets/cart.png")}
                style={commonStyles.fabIcon}
              />
            </Button>
            <Button disabled style={{ backgroundColor: "#DD5144" }}>
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
    margin: 20
  }
});
