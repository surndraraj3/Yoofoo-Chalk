import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import {
  Container,
  Content,
  Text,
  Input,
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
import commonStyles from "../styles/styles";

const deviceWidth = Dimensions.get("window").width;
export default class Help extends React.Component {
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
            <Title>Help</Title>
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
