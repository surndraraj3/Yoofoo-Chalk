import React from "react";
import {
  View,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from "react-native";
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
  CardItem,
  Label
} from "native-base";
import Modal from "react-native-modal";
import commonStyles from "../styles/styles";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
export default class ResendInvoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isModalVisible: false
    };
  }
  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  render() {
    return (
      <Container>
        <View style={{ padding: 10 }} />
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("Order")}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Resend Invoice</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.props.navigation.navigate("Home")}>
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
                <TouchableOpacity onPress={this._toggleModal}>
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 20,
                      fontWeight: "bold"
                    }}
                  >
                    Change Email
                  </Text>
                </TouchableOpacity>
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              {/* <TouchableOpacity onPress={this._toggleModal}>
                <Text>Show Modal</Text>
              </TouchableOpacity> */}
              <Modal
                isVisible={this.state.isModalVisible}
                style={{ width: deviceWidth, height: 40, backgroundColor: "#ffffff" }}
              >
                <View style={{ flex: 1 }}>
                  <Item stackedLabel>
                    <Label>Email</Label>
                    <Input placeholder="Enter Email" />
                  </Item>
                  <TouchableOpacity onPress={this._toggleModal}>
                    <Text> Close</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
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
