import React from 'react';
import { Text, View, Dimensions, TouchableHighlight } from 'react-native';
import {
    Container,
    Content,
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
    CardItem,
    Row
} from "native-base";
import commonStyles from "../styles/styles";

const deviceWidth = Dimensions.get("window").width;
export default class InventoryOrderDiscount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            discountPercent: 0,
            discountItemId: this.props.navigation.getParam("inventoryItemId")
        }
    }

    render() {
        return (
            <Container>
                <View style={{ padding: 10 }} />
                <Header style={{ backgroundColor: "#778899" }}>
                    <Left style={{flex: 1}}>
                        <Button
                            transparent
                            onPress={() => this.props.navigation.navigate("InventoryOrder",{
                                discountValue: this.state.discountPercent,
                                discountItem: this.state.discountItemId
                            })}
                        >
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Discount</Title>
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
                    <View style={commonStyles.buttomMaincontainer}>
                        <View style={commonStyles.buttonNestedContainer}><TouchableHighlight onPress={()=> {this.setState({discountPercent: 0})}}><Text style={commonStyles.textDiscount}>0</Text></TouchableHighlight></View>
                        <View style={commonStyles.buttonNestedContainer}><Text style={commonStyles.textDiscount}>$</Text></View>
                        <View style={commonStyles.buttonNestedContainer}><Text style={commonStyles.textDiscount}>None</Text></View>
                    </View>
                    <View style={commonStyles.buttomMaincontainer}>
                        <View style={commonStyles.buttonNestedContainer}><TouchableHighlight onPress={()=> {this.setState({discountPercent: 5})}}><Text style={commonStyles.textDiscount}>5</Text></TouchableHighlight></View>
                        <View style={commonStyles.buttonNestedContainer}><TouchableHighlight onPress={()=> {this.setState({discountPercent: 10})}}><Text style={commonStyles.textDiscount}>10</Text></TouchableHighlight></View>
                        <View style={commonStyles.buttonNestedContainer}><TouchableHighlight onPress={()=> {this.setState({discountPercent: 15})}}><Text style={commonStyles.textDiscount}>15</Text></TouchableHighlight></View>
                    </View>
                    <View style={commonStyles.buttomMaincontainer}>
                        <View style={commonStyles.buttonNestedContainer}><TouchableHighlight onPress={()=> {this.setState({discountPercent: 20})}}><Text style={commonStyles.textDiscount}>20</Text></TouchableHighlight></View>
                        <View style={commonStyles.buttonNestedContainer}><TouchableHighlight onPress={()=> {this.setState({discountPercent: 25})}}><Text style={commonStyles.textDiscount}>25</Text></TouchableHighlight></View>
                        <View style={commonStyles.buttonNestedContainer}><TouchableHighlight onPress={()=> {this.setState({discountPercent: 30})}}><Text style={commonStyles.textDiscount}>30</Text></TouchableHighlight></View>
                    </View>

                    <Card>
                        <CardItem>
                            <Left><Text>DesignerPrice</Text></Left>
                            <Right><Text>{"\u0024"} 4.59</Text></Right>
                        </CardItem>
                        <CardItem>
                            <Left><Text>MSRP</Text></Left>
                            <Right><Text>{"\u0024"} 4.59</Text></Right>
                        </CardItem>
                        <CardItem>
                            <Left><Text>Discount</Text></Left>
                            <Right><Text>0</Text></Right>
                        </CardItem>
                        <CardItem>
                            <Left><Text>Sale Price</Text></Left>
                            <Right><Text>{"\u0024"} 8.59</Text></Right>
                        </CardItem>
                    </Card>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', margin: 10 }}>
                        <Button bordered style={{ backgroundColor: "#00ffff" }}>
                            <Text
                                style={{
                                    color: "#ffffff",
                                    fontSize: 20,
                                    margin:10
                                }}
                            >
                                Cancel
                            </Text>
                        </Button>
                        <Button bordered style={{ backgroundColor: "#00ffff" }}>
                            <Text
                                style={{
                                    color: "#ffffff",
                                    fontSize: 20,   
                                    margin: 10                                 
                                }}
                            >
                                Save
                            </Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        );
    }
}

