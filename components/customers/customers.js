import React from "react";
import { StyleSheet, Text, Image, ScrollView, View } from "react-native";
import {
  Container,
  Button,
  Body,
  Header,
  Left,
  Right,
  Icon,
  Title,
  Content
} from "native-base";

export default class Customers extends React.Component {
  render() {
    return (
      <Container>
        <View style={{ padding: 10 }}/>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Home </Text>
          </Body>
          <Right />
        </Header>
        <Content>
          <ScrollView>
            <View style={styles.container}>
              <Image
                source={require("../../assets/new_customer.png")}
                style={{ height: 60, width: 60, borderRadius: 60 }}
              />
              <Image
                source={require("../../assets/inventory.png")}
                style={{ height: 60, width: 60, borderRadius: 60 }}
              />
              <Image
                source={require("../../assets/orders.png")}
                style={{ height: 60, width: 60, borderRadius: 60 }}
              />
              <Image
                source={require("../../assets/transfer.png")}
                style={{ height: 60, width: 60, borderRadius: 60 }}
              />
            </View>
          </ScrollView>          
        </Content>
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
  }
});
