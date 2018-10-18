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
  Content,
  List,
  ListItem,
  Item,
  Input,
  Card,
  CardItem
} from "native-base";
import commonStyles from "../styles/styles";

export default class Customers extends React.Component {
  render() {
    const customersList = [
      {
        customerId: 1,
        customerName: "Jeff",
        customerEmail: "Jeff@yoofoo.com",
        customerMobile: "8297132073"
      },
      {
        customerId: 2,
        customerName: "James",
        customerEmail: "James@yoofoo.com",
        customerMobile: "8297132074"
      },
      {
        customerId: 3,
        customerName: "Raj",
        customerEmail: "Raj@yoofoo.com",
        customerMobile: "8297132075"
      },
      {
        customerId: 5,
        customerName: "Joshua",
        customerEmail: "Joshua@yoofoo.com",
        customerMobile: "8297132076"
      },
      {
        customerId: 6,
        customerName: "Surendra",
        customerEmail: "Surendra@yoofoo.com",
        customerMobile: "8297132073"
      },
      {
        customerId: 7,
        customerName: "Kishore",
        customerEmail: "Kishore@yoofoo.com",
        customerMobile: "8297132074"
      },
      {
        customerId: 8,
        customerName: "Pavan",
        customerEmail: "Pavan@yoofoo.com",
        customerMobile: "8297132075"
      },
      {
        customerId: 9,
        customerName: "Rajesh",
        customerEmail: "Rajesh@yoofoo.com",
        customerMobile: "8297132076"
      }
    ];
    onListMenu = () => {
      UIManager.showPopupMenu(
        ReactNative.findNodeHandle(this._button),
        ["Create Order", "Edit Customer"],
        () => console.log("something went wrong with the popup menu"),
        (e, i) => {
          console.log(`${e} : ${i}`);
        }
      );
    };
    return (
      <Container>
        <View style={{ padding: 10 }} />
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("Home")}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Customer</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="home" />
            </Button>
            <Button transparent>
              <Icon name="more" />
            </Button>
          </Right>
        </Header>
        <Content>
          <ScrollView>
            <Item inlineLabel>
              <Input placeholder="Search Customer" />
            </Item>
            <View style={{ padding: 10 }} />
            {customersList.map((customerItem, index) => (
              <View key={index}>
                <View style={styles.row}>
                  <View style={styles.column}>
                    <Text numberOfLines={1}>{customerItem.customerName}</Text>
                    <Text numberOfLines={1}>{customerItem.customerEmail}</Text>
                    <Text numberOfLines={1}>{customerItem.customerMobile}</Text>
                  </View>
                  <View style={styles.popupMenuColumn}>
                    <TouchableNativeFeedback
                      ref={e => {
                        this._button = e;
                      }}
                      onPress={this.onListMenu}
                      background={TouchableNativeFeedback.Ripple("#f2f2f2")}
                    >
                      <Icon name="more" />
                    </TouchableNativeFeedback>
                  </View>
                </View>
                {/* <Item itemDivider/> */}
                <View
                  style={{
                    borderBottomColor: "blue",
                    borderBottomWidth: 1
                  }}
                />
              </View>
            ))}
            <View style={styles.addBottomIconRow}>
              <View style={styles.alignEndIcon}>
                <Button
                  transparent
                  onPress={() => this.props.navigation.navigate("AddCutsomer")}
                >
                  <Icon name="add" />
                </Button>
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
  },
  row: {
    margin: 15,
    flexDirection: "row"
  },
  column: {
    flexDirection: "column",
    justifyContent: "flex-start",
    flex: 4
  },
  popupMenuColumn: {
    flexDirection: "column",
    alignSelf: "flex-end",
    flex: 1
  },
  addBottomIconRow: {
    flex: 1,
    justifyContent: "flex-end"
  },
  alignEndIcon: {
    alignSelf: "flex-end"
    // color: "#841584"
  }
});
