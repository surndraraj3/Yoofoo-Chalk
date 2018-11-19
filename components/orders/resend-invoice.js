import React from "react";
import {
  View,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage
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
import _ from "lodash";
import Modal from "react-native-modal";
//import HTMLView from "react-native-htmlview";
import { getInvoiceDetailsByOrderIdUrl } from "../common/url_config";
import commonStyles from "../styles/styles";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
export default class ResendInvoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isModalVisible: false,
      distributorId: "",
      authToken: "",
      invoiceOrderNumber: this.props.navigation.getParam("OrderNumber"),
      invoiceList: [],
      lineInfoDtls: []
    };
  }
  componentDidMount = async () => {
    this.setState({ loading: true });
    await AsyncStorage.getItem("LoginDetails").then(responseOrderDtlsJson => {
      responseOrderDtlsJson = JSON.parse(responseOrderDtlsJson);
      this.setState({
        distributorId: responseOrderDtlsJson.DistributorID,
        authToken: responseOrderDtlsJson.Token
      });
    });
    fetch(`${getInvoiceDetailsByOrderIdUrl}${this.state.invoiceOrderNumber}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.state.authToken}`
      }
    })
      .then(invoiceResp => invoiceResp.json())
      .then(invoiceRespJson => {
        //console.log("Data", invoiceRespJson);
        this.setState({
          invoiceList: invoiceRespJson
        });
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error(error);
      });
  };
  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  render() {
    const getLineDetailInfosDtls = _.get(
      this.state.invoiceList,
      "LineDetailInfos"
    );
    // var result = _.map(getLineDetailInfosDtls, item => ({
    //   id: item.Quantity,
    //   name: item.Price
    // }));
    // console.log("Result", result);
    // this.setState({lineInfoDtls: getLineDetailInfosDtls});
    // console.log('getDtls', getLineDetailInfosDtls);
    // console.log('getLine Info Dtls', this.state.lineInfoDtls);
    return (
      <Container>
        <View style={{ padding: 10 }} />
        <Header style={{ backgroundColor: "#778899" }}>
          <Left style={{ flex: 1 }}>
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
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("Home")}
            >
              <Icon name="home" />
            </Button>
            <Button transparent>
              <Icon name="more" />
            </Button>
          </Right>
        </Header>
        <Content>
          <ScrollView>
            {/* Get ORDER Info details from end point response list */}
            <Card>
              <CardItem header bordered>
                <Text>ORDER INFO</Text>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Order Number</Text>
                </Left>
                <Right>
                  <Text>{this.state.invoiceList.OrderNumber}</Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Shipping Method</Text>
                </Left>
                <Right>
                  <Text>{this.state.invoiceList.ShippingMethod}</Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Customer Name</Text>
                </Left>
                <Right>
                  <Text>{this.state.invoiceList.CustomerName}</Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Sales Tax ID</Text>
                </Left>
                <Right>
                  <Text>{this.state.invoiceList.SalesTaxID}</Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Date</Text>
                </Left>
                <Right>
                  <Text>{this.state.invoiceList.Date}</Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Email</Text>
                </Left>
                <Right>
                  <Text>{this.state.invoiceList.Email}</Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Phone</Text>
                </Left>
                <Right>
                  <Text>{this.state.invoiceList.Phone}</Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Personal Use</Text>
                </Left>
                <Right>
                  <Text>{this.state.invoiceList.PersonalUse}</Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Purchase From</Text>
                </Left>
                <Right>
                  <Text>{this.state.invoiceList.PurchasedFrom}</Text>
                </Right>
              </CardItem>
            </Card>
            {/* Get Payment Info details from end point response list */}
            <Card>
              <CardItem header bordered>
                <Text>Payment Info</Text>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Payment Date</Text>
                </Left>
                <Right>
                  <Text>
                    {_.get(this.state.invoiceList, "PaymentInfo.PaymentDate")}
                  </Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Payment Method</Text>
                </Left>
                <Right>
                  <Text>
                    {_.get(this.state.invoiceList, "PaymentInfo.PaymentMethod")}
                  </Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Payment Amount</Text>
                </Left>
                <Right>
                  <Text>
                    {_.get(this.state.invoiceList, "PaymentInfo.PaymentAmount")}
                  </Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Payee Name</Text>
                </Left>
                <Right>
                  <Text>
                    {_.get(this.state.invoiceList, "PaymentInfo.PaymentName")}
                  </Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Billing Name</Text>
                </Left>
                <Right>
                  <Text>
                    {_.get(this.state.invoiceList, "PaymentInfo.BillingName")}
                  </Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Billing Address1</Text>
                </Left>
                <Right>
                  <Text>
                    {_.get(
                      this.state.invoiceList,
                      "PaymentInfo.BillingAddress1"
                    )}
                  </Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Billing Address2</Text>
                </Left>
                <Right>
                  <Text>
                    {_.get(
                      this.state.invoiceList,
                      "PaymentInfo.BillingAddress2"
                    )}
                  </Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Billing City</Text>
                </Left>
                <Right>
                  <Text>
                    {_.get(this.state.invoiceList, "PaymentInfo.BillingCity")}
                  </Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Billing State</Text>
                </Left>
                <Right>
                  <Text>
                    {_.get(this.state.invoiceList, "PaymentInfo.BillingState")}
                  </Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Billing Zip</Text>
                </Left>
                <Right>
                  <Text>
                    {_.get(this.state.invoiceList, "PaymentInfo.BillingZip")}
                  </Text>
                </Right>
              </CardItem>
              <CardItem>
                <Left>
                  <Text>Billing Country</Text>
                </Left>
                <Right>
                  <Text>
                    {_.get(
                      this.state.invoiceList,
                      "PaymentInfo.BillingCountry"
                    )}
                  </Text>
                </Right>
              </CardItem>
            </Card>            
            {/* <Card>
              <CardItem header bordered>
                <Text>Order Number</Text>
                <Text>12345</Text>
              </CardItem>
            </Card> */}
            <Card>
              {/* <CardItem header>
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
              </CardItem> */}
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
                  <Text>Quantity</Text>
                </View>                
                <View style={styles.box}>
                  <Text>Item Number</Text>
                </View>
                <View style={styles.box}>
                  <Text style={{ flex: 1, flexWrap: "wrap" }}>Description</Text>
                </View>
                <View style={styles.box}>
                  <Text style={{ flex: 1, flexWrap: "wrap" }}>
                    Price
                  </Text>
                </View>
                <View style={styles.box}>
                  <Text>Total</Text>
                </View>
              </View>
              {_.map(getLineDetailInfosDtls, item => (
              <View style={styles.container}>                
                <View style={styles.box}>
                  <Text>{item.Quantity}</Text>
                </View>
                <View style={styles.box}>
                  <Text>{item.ItemCode}</Text>
                </View>  
                <View style={styles.box}>
                  <Text>Description</Text>
                </View> 
                <View style={styles.box}>
                  <Text>{item.Price}</Text>
                </View>  
                <View style={styles.box}>
                  <Text>{item.LineTotal}</Text>
                </View>                            
              </View>
            ))}
              {/* <View style={styles.container}>
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
              </View> */}
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
                style={{
                  width: deviceWidth,
                  height: 40,
                  backgroundColor: "#ffffff"
                }}
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
        {this.state.loading && (
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
        )}
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
