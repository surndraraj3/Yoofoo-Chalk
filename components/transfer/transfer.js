import React from "react";
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView
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
  Title
} from "native-base";
import commonStyles from "../styles/styles";

export default class Transfer extends React.Component {
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
            <Title>Transfer</Title>
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
            <Text>Welcome To Transfer</Text>
            {/* <KeyboardAvoidingView
              style={{ flex: 1 }}
              keyboardVerticalOffset={100}
              behavior={"position"}
            >
              <TextInput placeholder="Email" style={commonStyles.input} />
              <TextInput placeholder="Username" style={commonStyles.input} />
              <TextInput placeholder="Password" style={commonStyles.input} />
              <TextInput
                placeholder="Confirm Password"
                style={commonStyles.input}
              />
              <TextInput placeholder="Email" style={commonStyles.input} />
              <TextInput placeholder="Username" style={commonStyles.input} />
              <TextInput placeholder="Password" style={commonStyles.input} />
              <TextInput
                placeholder="Confirm Password"
                style={commonStyles.input}
              />
            </KeyboardAvoidingView> */}
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
