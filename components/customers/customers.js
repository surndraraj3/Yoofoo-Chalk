import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  ScrollView,
  View,
  UIManager,
  findNodeHandle,
  TouchableOpacity,  
  ActivityIndicator,
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
  List,
  ListItem,
  Item,
  Input,
  Card,
  CardItem,
  Fab
} from "native-base";
import { getCustomerListURL } from "../common/url_config";
import commonStyles from "../styles/styles";

export default class Customers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      active: "true",
      customersListData: [],
      distributorId: "",
      customerCount: 0,
      authToken:""
    };
  }
  //get Customers list
  componentDidMount = async () => {    
   
    await AsyncStorage.getItem('LoginDetails')
    // .then(response => response.json())
    .then(responseJson => {
      responseJson = JSON.parse(responseJson);
      // console.log(responseJson.message, responseJson.DistributorID);
      this.setState({distributorId: responseJson.DistributorID, authToken: responseJson.Token})
    })
   
    console.log('url', `${getCustomerListURL}${this.state.distributorId}`);
    fetch(`${getCustomerListURL}${this.state.distributorId}`, {
      method: "GET",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.state.authToken}`
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson);
        this.setState({
          customersListData: responseJson,
          customerCount: responseJson.length
        });
        this.setState({ loading: false, });
      })
      .catch(error => {
        console.error(error);
        this.setState({ loading: false });
      });
  };
  onChangeFab = fabitem => {
    console.log("item", fabitem);
  };
  //show spinner
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
          }}
        />
      );
    } else {
      return null;
    }
  }
  //Show Floating Button
  renderFloatingActionButton() {
    return (
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
        <Button
          style={{ backgroundColor: "#34A34F" }}
          onPress={() => this.props.navigation.navigate("AddCutsomer")}
        >
          <Image
            source={require("../../assets/new_customer.png")}
            style={{
              height: 40,
              width: 40,
              borderRadius: 40 / 2
            }}
          />
        </Button>
      </Fab>
    );
  }
  onOpenMenu = openMenuid => {
    console.log("Ids", openMenuid);
    UIManager.showPopupMenu(
      findNodeHandle(this._button),
      ["Create Order"],
      () => console.log("something went wrong with the popup menu"),
      (e, i) => {
        console.log(`${e} : ${i}`);
        if (i === 0) {
          this.props.navigation.navigate("TransferOrder", {
            customerId: openMenuid
          });
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
          <View style={{ backgroundColor: "#e6e6e6" }}>
            <Text style={{ margin: 15, fontSize: 20 }}>{this.state.customerCount} Customers</Text>
            <View style={{ margin: 15, borderColor: "#595959" }}>
              <Item rounded>
                <Input
                  placeholder="Search by Name or Email"
                  style={{
                    textAlign: "center",
                    height: 50,
                    borderWidth: 2,
                    borderColor: "#00e6e6",
                    borderRadius: 20,
                    backgroundColor: "#FFFFFF"
                  }}
                />
                <Icon active name="search" />
              </Item>
            </View>
          </View>          
          <ScrollView>
          <Text style={commonStyles.warningMessage}>{(this.state.customerCount === 0 ? 'No Customers Found': '')} </Text>
            {this.state.customersListData.map((itm, i) => (
              <View key={i}>
                <Text style={commonStyles.warningMessage}>{(itm.length === 0 ? 'No Customers Found': '')}</Text>
                <Card>
                  <CardItem>
                    <Left>
                      <Text>
                        {itm.FirstName} {itm.LastName}
                      </Text>
                    </Left>
                  </CardItem>
                  <CardItem>
                    <Left>
                      <Text>{itm.Email}</Text>
                    </Left>
                    <Right>
                      <TouchableOpacity
                        ref={e => {
                          this._button = e;
                        }}
                        onPress={() => this.onOpenMenu(itm.CustomerID)}
                        style={commonStyles.iconCircle}
                      >
                        <Icon
                          name="ellipsis-v"
                          type="FontAwesome"
                          style={{ fontSize: 20, color: "#55e6f6" }}
                        />
                      </TouchableOpacity>
                    </Right>
                  </CardItem>
                  <CardItem>
                    <Left>
                      <Text>{itm.Phone}</Text>
                    </Left>
                  </CardItem>
                </Card>
              </View>
            ))}
          </ScrollView>          
        </Content>
        {this.renderLoading()}
        {this.renderFloatingActionButton()}
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
