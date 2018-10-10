import React from "react";
import ReactNative, {
  StyleSheet,
  Text,
  Image,
  ScrollView,
  View,
  UIManager,
  TouchableNativeFeedback
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
  Content
} from "native-base";
import commonStyles from "../styles/styles";

export default class Customers extends React.Component {
  onOpenMenu = () => {
    UIManager.showPopupMenu(
      ReactNative.findNodeHandle(this._button),
      ["Profile", "Settings", "Help", "Signout"],
      () => console.log("something went wrong with the popup menu"),
      (e, i) => {
        console.log(`${e} : ${i}`);
        if (i === 0) {
          this.props.navigation.navigate("Profile");
        } else {
          console.log(`${e} : ${i}`);
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
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Home </Text>
          </Body>
          <Right>
            <TouchableNativeFeedback
              ref={e => {
                this._button = e;
              }}
              onPress={this.onOpenMenu}
              background={TouchableNativeFeedback.Ripple("#d0d0d0")}
            >
              <Icon name="more" />
            </TouchableNativeFeedback>
          </Right>
        </Header>
        <Content>
          <ScrollView>
            <View style={styles.container}>
              <View>
                <Image
                  source={require("../../assets/customer.png")}
                  style={commonStyles.imgDashboardIcon}
                />
                <Text>Customer</Text>
              </View>
              <View>
                <Image
                  source={require("../../assets/inventory.png")}
                  style={commonStyles.imgDashboardIcon}
                />
                <Text>Inventory</Text>
              </View>
              <View>
                <Image
                  source={require("../../assets/transfer.png")}
                  style={commonStyles.imgDashboardIcon}
                />
                <Text>Transfer</Text>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: "row", marginLeft: 50 }}>
              <View>
                <Image
                  source={require("../../assets/orders.png")}
                  style={commonStyles.imgDashboardIcon}
                />
                <Text>Order</Text>
              </View>
            </View>
          </ScrollView>
        </Content>
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
