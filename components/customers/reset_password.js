import React from "react";
import { Text, View } from "react-native";
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
  Body
} from "native-base";
import commonStyles from "../styles/styles";

export default class ResetPassword extends React.Component {
  render() {
    return (
      <Container>
        <View style={{ padding: 10 }} />
        <Button full>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Reset Password
          </Text>
        </Button>
        <Content>
          <Text style={commonStyles.logoStyles}>Chalk COUTURE</Text>
          <Form>
            <Label style={commonStyles.labelPos}>Username/Email</Label>
            <Item>
              <Input />
              <Icon active name="close-circle" />
            </Item>
            <View style={commonStyles.buttonCommonMargin}>
              <Button block>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Submit</Text>
              </Button>
            </View>
          </Form>
        </Content>
      </Container>
    );
  }
}
