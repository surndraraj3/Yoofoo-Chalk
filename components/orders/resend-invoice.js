import React from "react";
import { View, Dimensions, ScrollView, StyleSheet } from "react-native";
import {
  Container,
  Content,
  Icon,
  Button,
  Header,
  Body,
  Left,
  Right,
  Title,
  Item,
  Input,
  Text,
  Card,
  CardItem
} from "native-base";
import commonStyles from "../styles/styles";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
export default class ResendInvoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }
  render() {
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
            <Title>Resend Invoice</Title>
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
            <Card>
              <CardItem header>
                <Text>Order Number</Text>
                <Text>12345</Text>
              </CardItem>
            </Card>
            <Card>
              <CardItem header>
                <Left>
                  <Text>Order Number</Text>
                </Left>
                <Right>
                  <Text>12345</Text>
                </Right>
              </CardItem>
              <CardItem header>
                <Left>
                  <Text>Date</Text>
                </Left>
                <Right>
                  <Text>12/3/18</Text>
                </Right>
              </CardItem>
              <CardItem header>
                <Left>
                  <Text>Email</Text>
                </Left>
                <Right>
                  <Text>Wilma@mail.com</Text>
                </Right>
              </CardItem>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#cccccc",
                  justifyContent: "space-around",
                  width: deviceWidth,
                  height: 75,
                  backgroundColor: "#cccccc"
                }}
              >
                <View style={styles.box}>
                  <Text>SKU</Text>
                </View>
                <View style={styles.box}>
                  <Text style={{ flex: 1, flexWrap: "wrap" }}>Description</Text>
                </View>
                <View style={styles.box}>
                  <Text>Quantity</Text>
                </View>
                <View style={styles.box}>
                  <Text style={{ flex: 1, flexWrap: "wrap" }}>
                    Price per unit
                  </Text>
                </View>
                <View style={styles.box}>
                  <Text>Total</Text>
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.box}>
                  <Text>B18352</Text>
                </View>
                <View style={styles.box}>
                  <Text>(B) Mini Holiday Icon</Text>
                </View>
                <View style={styles.box}>
                  <Text>1</Text>
                </View>
                <View style={styles.box}>
                  <Text>$8.99</Text>
                </View>
                <View style={styles.box}>
                  <Text>$8.99</Text>
                </View>
                <View style={styles.box}>
                  <Text>303352</Text>
                </View>
                <View style={styles.box}>
                  <Text>(S) Aiden Black</Text>
                </View>
                <View style={styles.box}>
                  <Text>1</Text>
                </View>
                <View style={styles.box}>
                  <Text>$8.99</Text>
                </View>
                <View style={styles.box}>
                  <Text>$8.99</Text>
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.box}>
                  <Text>303352</Text>
                </View>
                <View style={styles.box}>
                  <Text>(S) Aiden Black</Text>
                </View>
                <View style={styles.box}>
                  <Text>1</Text>
                </View>
                <View style={styles.box}>
                  <Text>$8.99</Text>
                </View>
                <View style={styles.box}>
                  <Text>$8.99</Text>
                </View>
              </View>
            </Card>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                margin: 10
              }}
            >
              <Button bordered style={{ backgroundColor: "#00ffff" }}>
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: 20,
                    fontWeight: "bold"
                  }}
                >
                  Resend Invoice
                </Text>
              </Button>
              <Button bordered style={{ backgroundColor: "#00ffff" }}>
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: 20,
                    fontWeight: "bold"
                  }}
                >
                  Change Email
                </Text>
              </Button>
            </View>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // justifyContent:'space-around',
    //flexWrap: "wrap",
    // height: 300,
    alignItems: "center"
  },
  box: {
    height: 75,
    width: deviceWidth / 5,
    // backgroundColor: "lime",
    borderWidth: 1,
    borderColor: "#d9d9d9"
  }
});
