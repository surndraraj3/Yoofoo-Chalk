import React from "react";
import { connect } from "react-redux";
import store from "../store/store";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  UIManager,
  findNodeHandle,
  ActivityIndicator,
  AsyncStorage,
  ImageBackground,
  TouchableHighlight,
  FlatList
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
  Item,
  Input,
  Card,
  CardItem,
  Fab,
  Picker,
  List
} from "native-base";
import OptionsMenu from "react-native-options-menu";
import { getCustomerListURL } from "../common/url_config";
import commonStyles from "../styles/styles";

class Customers extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      active: false,
      customersListData: [],
      distributorId: "",
      customerCount: 0,
      authToken: "",
      searchCustomerList: [],
      selPickItm: "test",
      pageNumber: 1,
      recordsPerPage: 5
    };
  }
  //get Customers list
  componentDidMount = async () => {
    this._isMounted = true;
    var newState = store.getState();
    // console.log('newState', newState.tokenReducer.loginInfo.tokenKey);
    if (this._isMounted) {
      await this.setState({
        authToken: newState.tokenReducer.loginInfo.tokenKey,
        distributorId: newState.tokenReducer.loginInfo.distributorKey
      });
    }

    if (this._isMounted) this.loadCustomerDetails();
  };
  componentWillUnmount() {
    this._isMounted = false;
  }
  //Load Customer Details
  loadCustomerDetails = () => {    
   
    fetch(
      `${getCustomerListURL}${this.state.distributorId}/${
        this.state.pageNumber
      }/5`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.state.authToken}`
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          customersListData: this.state.customersListData.concat(responseJson),
          customerCount: responseJson.length
        });
        this.setState({ loading: false });
      })
      .catch(error => {
        //console.error(error);
        this.setState({ customersListData: [] });
        this.setState({ loading: false });
      });
  };
  //
  componentWillMount = () => {
    this.setState({ customersListData: [] });
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
        onPress={() => this.props.navigation.navigate("AddCutsomer")}
      >
        {/* <Icon name="user-plus" type="FontAwesome" /> */}
        <ImageBackground
          resizeMode={"stretch"} // or cover
          style={{
            height: "100%",
            width: "100%",
            color: "#fff"
          }}
          source={require("../../assets/new_customer.png")}
        />
      </Fab>
    );
  }
  onOpenMenu = openMenuid => {
    UIManager.showPopupMenu(
      findNodeHandle(this._button),
      ["Create Order"],
      () => console.log("something went wrong with the popup menu"),
      (e, i) => {
        if (i === 0) {
          this.props.navigation.navigate("TransferOrder", {
            customerId: openMenuid
          });
        } else {
          //console.log(`${e} : ${i}`);
        }
      }
    );
  };
  //Search Customer
  onSearchCustomer = txtSrchCustomer => {
    if (txtSrchCustomer === "") this.loadCustomerDetails();
    else {
      const rsSrchCustomer = this.state.customersListData.filter(
        cstmrItm =>
          cstmrItm.FirstName.toLowerCase().includes(
            txtSrchCustomer.toLowerCase()
          ) ||
          cstmrItm.LastName.toLowerCase().includes(
            txtSrchCustomer.toLowerCase()
          ) ||
          cstmrItm.Email.toLowerCase().includes(
            txtSrchCustomer.toLowerCase()
          ) ||
          cstmrItm.Phone.includes(txtSrchCustomer)
      );      
      this.setState({
        customersListData: rsSrchCustomer,
        customerCount: rsSrchCustomer.length
      });
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
  onScrollPageEnd = () => {
    this.setState(
      { pageNumber: this.state.pageNumber + 1 },
      this.loadCustomerDetails
    );
  };
  render() {
    return (
      <Container>
        <View style={{ padding: 10 }} />
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
            <Title>Customer</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("Home")}
            >
              <Icon name="home" />
            </Button>
            <TouchableHighlight style={commonStyles.ellipsBtnTouch}>
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
        {/* <Content /> */}
        <View>
          <View style={{ backgroundColor: "#e6e6e6" }}>
            <Text style={{ margin: 15, fontSize: 12 }}>
              {this.state.customerCount} Customers
            </Text>
            <View style={{ margin: 15 }}>
              <Item>
                <Input
                  placeholder="Search by Name or Email"
                  style={{
                    textAlign: "center",
                    height: 50
                  }}
                  onChangeText={this.onSearchCustomer}
                />
                <Icon active name="search" />
              </Item>
            </View>
          </View>
          <FlatList
            data={this.state.customersListData}
            renderItem={({ item }) => (
              <Card>
                <CardItem>
                  <Left>
                    <Text>
                      {item.FirstName} {item.LastName}
                    </Text>
                  </Left>
                </CardItem>
                <CardItem>
                  <Left>
                    <Text>{item.Email}</Text>
                  </Left>
                  <Right>
                    <Button
                      bordered
                      style={{
                        backgroundColor: "#61d0c8",
                        width: 120,
                        height: 40,
                        margin: 10,
                        justifyContent: "center",
                        borderColor: "#ffffff"
                      }}
                      onPress={() => {
                        this.props.navigation.navigate("InventoryOrder", {
                          customerID: item.CustomerID,
                          customerDistributorId: this.state.distributorId,
                          clickOn: 1
                        });
                      }}
                    >
                      <Text
                        style={{
                          color: "#ffffff",
                          fontSize: 15,
                          fontWeight: "bold"
                        }}
                      >
                        Create Order
                      </Text>
                    </Button>
                  </Right>
                </CardItem>
                <CardItem>
                  <Left>
                    <Text>{item.Phone}</Text>
                  </Left>
                </CardItem>
              </Card>
            )}
            // keyExtractor={item => item.CustomerID}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={this.onScrollPageEnd}
            onEndReachedThreshold={0}
            // ItemSeparatorComponent={this.renderSeparator}
          />
        </View>

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

const mapStateToProps = state => {
  return {
    tokenValue: state.tokenReducer.authToken
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getLoginUserToken: () => dispatch({ type: "GetTokenValue" })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Customers);
