import React from "react";
import { Text, View, ActivityIndicator, AsyncStorage } from "react-native";
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
  Title
} from "native-base";
import commonStyles from "../styles/styles";
import { custPrflURL } from "../common/url_config";

export default class CustomerProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerProfileData: "",
      loading: true,
      distributorId: "",
    };
  }
  componentDidMount = async () => {   
    await AsyncStorage.getItem('LoginDetails')
    // .then(response => response.json())
    .then(responseJson => {
      responseJson = JSON.parse(responseJson);
      // console.log(responseJson.message, responseJson.DistributorID);
      this.setState({distributorId: responseJson.DistributorID})
    }) 
    // console.log(`${custPrflURL}${this.state.distributorId}`);
    fetch(`${custPrflURL}${this.state.distributorId}`, {
      method: "GET"
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson);
        this.setState({
          customerProfileData: responseJson
        });
        // console.log(this.state.customerProfileData);
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error(error);
        this.setState({ loading: false });
      });
  };
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
            top: 0,
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
        {/* <Button full>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Profile</Text>
        </Button> */}
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
            <Title>Profile</Title>
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
          <Form>
            <Label style={commonStyles.labelPos}>Designer Id</Label>
            <Item>
              <Text style={{ padding: 10 }}>
                {this.state.customerProfileData.customerIDField}
              </Text>
            </Item>
            <Label style={commonStyles.labelPos}>First Name</Label>
            <Item>
              <Text style={{ padding: 10 }}>
                {this.state.customerProfileData.firstNameField}
              </Text>
            </Item>
            <Label style={commonStyles.labelPos}>Last Name</Label>
            <Item>
              <Text style={{ padding: 10 }}>
                {this.state.customerProfileData.lastNameField}
              </Text>
            </Item>
            <Label style={commonStyles.labelPos}>Phone Number</Label>
            <Item>
              <Text style={{ padding: 10 }}>
                {this.state.customerProfileData.phoneField}
              </Text>
            </Item>
            <Label style={commonStyles.labelPos}>Email</Label>
            <Item>
              <Text style={{ padding: 10 }}>
                {this.state.customerProfileData.emailField}
              </Text>
            </Item>
            {/* <View style={commonStyles.buttonCommonMargin}>
              <Button block>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Submit</Text>
              </Button>
            </View> */}            
            {this.renderLoading()}
          </Form>
        </Content>
      </Container>
    );
  }
}
