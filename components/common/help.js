import React from "react";
import { View, AsyncStorage, TouchableHighlight } from "react-native";
import {
  Container,
  Content,
  Text,
  Icon,
  Label,
  Header,
  Body,
  Button,
  Left,
  Right,
  Title,
  Card,
  CardItem
} from "native-base";
import OptionsMenu from "react-native-options-menu";
import commonStyles from "../styles/styles";


export default class Help extends React.Component {
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
  render() {
    return (
      <Container>
        <View style={{ padding: 10 }} />
        <Header style={{ backgroundColor: "#778899" }}>
          <Left style={{flex: 1}}>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("Home")}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Help</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.props.navigation.navigate("Home")}>
              <Icon name="home" />
            </Button>
            <TouchableHighlight style={{
                borderWidth: 0,
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40
              }}>
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
        <Content padder>
          <Card>
            <CardItem header bordered>
              <Text>Contact</Text>
            </CardItem>
            <CardItem>
              <View style={commonStyles.rowData}>
                <Label>Email</Label>
                <Label>support@chalkcouture.com</Label>
              </View>
            </CardItem>
            <CardItem>
              <View style={commonStyles.rowData}>
                <Label>Phone</Label>
                <Label>844.673.6316</Label>
              </View>
            </CardItem>
            {/* <CardItem footer bordered>
              <Text>GeekyAnts</Text>
            </CardItem> */}
          </Card>
        </Content>
      </Container>
    );
  }
}
