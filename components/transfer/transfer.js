import React from "react";
import {
  Text,
  View,
  ScrollView,
  AsyncStorage,
  ActivityIndicator,
  TouchableHighlight
} from "react-native";
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Icon,
  Button,
  Header,
  Body,
  Left,
  Right,
  Title,
  ListItem,
  List
} from "native-base";
import Toast from "react-native-simple-toast";
import { getDesignerListUrl } from "../common/url_config";
import commonStyles from "../styles/styles";

export default class Transfer extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      distributorId: "",
      authToken: "",
      designerList: [],
      srchDsgnrId: ""
    };
  }
  //get the token and pass it to end point, fetch respose and assign it to an array
  componentDidMount = async () => {
    this._isMounted = true;
    await AsyncStorage.getItem("LoginDetails").then(resLoginDtls => {
      resLoginDtls = JSON.parse(resLoginDtls);
      if (this._isMounted) {
        this.setState({
          distributorId: resLoginDtls.DistributorID,
          authToken: resLoginDtls.Token
        });
      }
    });
  };
  //Handle To load designer list
  handleDesignerList = () => {
    console.log("Welcome Search", this.state.srchDsgnrId);
    this.renderLoading();
    this.setState({ loading: true });
    if (this.state.srchDsgnrId !== "") {
      fetch(`${getDesignerListUrl}${this.state.srchDsgnrId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.state.authToken}`
        }
      })
        .then(rspDsgnrs => rspDsgnrs.json())
        .then(respDsgnrJson => {
          console.log("test", respDsgnrJson);
          if (!respDsgnrJson.Message) {
            this.setState({ designerList: respDsgnrJson, loading: false });
            this.handleLoadDesignersListView();
          } else {
            Toast.showWithGravity(
              `No data found: ${respDsgnrJson.Message}`,
              Toast.SHORT,
              Toast.CENTER
            );
          }
        });
    } else {
      Toast.showWithGravity(`Designer id is empty`, Toast.SHORT, Toast.CENTER);
      this.setState({ loading: false });
    }
  };
  //----Load designer in form of list view------
  handleLoadDesignersListView = () => {
    return (
      <List>
        <ListItem selected>
          <Body>
            <Text>
              {this.state.designerList.FirstName}{" "}
              {this.state.designerList.LastName}
            </Text>
          </Body>
          <Right>
            <TouchableHighlight
              onPress={() =>
                this.props.navigation.navigate("DesignerInventory")
              }
            >
              {this.state.designerList.LastName ? (
                <Icon name="arrow-forward" />
              ) : (
                <Icon />
              )}
            </TouchableHighlight>
          </Right>
        </ListItem>
      </List>
    );
  };
  // Loading symbol
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
            // backgroundColor: 'red',
            // opacity: 0.3
          }}
        />
      );
    } else {
      return null;
    }
  }

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
            <Title>Transfer Order</Title>
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
            <View style={{ backgroundColor: "#e6e6e6" }}>
              <Text style={{ margin: 15, fontSize: 12 }}>Designer Id</Text>
              <View style={{ margin: 15 }}>
                <Item>
                  <Input
                    placeholder="Search by Designer Id"
                    style={{
                      textAlign: "center",
                      height: 50
                    }}
                    value={this.state.srchDsgnrId}
                    onChangeText={srchVal => {
                      this.setState({ srchDsgnrId: srchVal });
                    }}
                  />
                  <TouchableHighlight onPress={this.handleDesignerList}>
                    <Icon active name="search" />
                  </TouchableHighlight>
                </Item>
              </View>
            </View>
            <View>{this.handleLoadDesignersListView()}</View>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
