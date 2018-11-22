import React from "react";
import { Text, View,Image, Dimensions, TouchableHighlight } from "react-native";
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
  Title,
  Right
} from "native-base";
import commonStyles from "../styles/styles";
const windowWidth = Dimensions.get("window").width;
export default class ResetPassword extends React.Component {
  render() {
    return (
      <Container>
        {/* <View style={{ padding: 10 }} />
        <Button full>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Reset Password
          </Text>
        </Button> */}
        <View style={{ padding: 10 }} />
        <Header style={{ backgroundColor: "#778899" }}>          
          <View style={{flex: 2 , justifyContent: "center"}}>
            <Title>Reset Password</Title>
          </View>    
          <Right>
            <TouchableHighlight onPress={() => this.props.navigation.navigate("Login")}>
              <Icon name="sign-in" type="FontAwesome" style={{ color: "#ffffff" }}/>  
            </TouchableHighlight>
          </Right>      
        </Header>
        <Content>
          <View
            style={{
              flexDirection: "row",
              margin: 40,
              justifyContent: "space-around"
            }}
          >
            <Image source={require("../../assets/logo.png")} />
          </View>
          <Form>
            <Label style={commonStyles.labelPos}>Username/Email</Label>
            <Item>
              <Input />
              <Icon active name="close-circle" />
            </Item>
            <View style={{justifyContent: "space-around", padding: 15}}>
              <Button style={{ backgroundColor: '#61d0c8', width: windowWidth -20 ,justifyContent: "space-around"}}>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "#ffffff" }}>Submit</Text>
              </Button>
            </View>
          </Form>
        </Content>
      </Container>
    );
  }
}
