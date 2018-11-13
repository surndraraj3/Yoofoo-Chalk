import React from "react";
import {
  View,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import {
  Container,
  Content,
  Icon,
  Button,
  Header,
  Body,
  Left,
  Right,
  Title,
  Item,
  Input,
  Text,
  Card,
  CardItem,
  Label
} from "native-base";
import Modal from "react-native-modal";
import HTMLView from "react-native-htmlview";
import commonStyles from "../styles/styles";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
export default class ResendInvoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isModalVisible: false,
      distributorId: "",
      authToken: ""
    };
  }
  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  render() {
    const htmlContent = `
    <!doctype html public '-//w3c//dtd html 4.0 transitional//en'> 
        <html>
            <head id='ctl00_Head1'>
                  <style> 

        @media print
        {
          div.rptDiv
          {
            background: white;
            overflow: visible;
          }
        }
        div.rptDiv
        {
          overflow: auto;
        }
        body
        {
          scrollbar-3dlight-color: #ADCCE4;
          scrollbar-arrow-color: #356B93;
          scrollbar-darkshadow-color: #ADCCE4;
          scrollbar-face-color: #DBEAF5;
          scrollbar-highlight-color: #FFFFFF;
          scrollbar-shadow-color: #DBEAF5;
          scrollbar-track-color: #E6F0F7;
        }
        body, td, input, select, th, textarea
        {
          font-family: verdana;
          font-size: 8pt;
          color: #393939;
        }
        h5
        {
          page-break-after: always;
        }
        a
        {
          text-decoration: none;
        }
        a:hover
        {
          text-decoration: underline;
        }
        a, a:visited, a:hover
        {
          color: #003399;
        }
        Table.ActionGridBar, Table.ActionGridBar TD
        {
          border: 1px solid #6699cc;
          background-color: #E6EEF7;
          font-weight: bold;
          cursor: hand;
        }

        Table.ActionGridHeader
        {
          background-color: #E6EEF7;
        }
        Table.ActionGridData
        {
          border: none;
        }
        Table.ActionGridData TD
        {
          border: 1px solid #E6EEF7;
        }
        Table.ActionGridFooter
        {
          border: 1px solid #6699cc;
          background-color: #E6EEF7;
        }
        Table.ActionGridFooter TD, Table.ActionGridFooter A:hover, Table.ActionGridFooter A:visited, Table.ActionGridFooter A
        {
          font-size: 10pt;
          font-weight: normal;
        }
        TABLE.clsReport
        {
          border-collapse: collapse;
          table-layout: fixed;
          overflow: auto;
        }
        TABLE.clsReport TH
        {
          border: 1px solid #4791C5;
          padding: 5px;
          font-weight: normal;
          background-color: #ECF4F9;
        }
        TABLE.clsReport TH:first-child
        {
          border-left: 1px solid #4791C5;
        }
        TABLE.clsReport TD
        {
          padding: 2px;
          padding-left: 8px;
          padding-right: 8px;
        }


        .deeptree span
        {
          padding: 2px 2px;
          position: relative;
          display: inline;
          top: 0px;
          height: 17px;
          margin: 1px;
          cursor: hand;
        }
        span.clsLabel
        {
        }
        .clsSpace
        {
          position: relative;
          width: 10px;
          cursor: hand;
          overflow: hidden;
          margin-left: -6px;
          margin-top: -11px;
          padding-left: 0px;
        }
        SPAN.clsMouseOver
        {
          background-color: #F2F8FC;
          border: 1px solid #EAF3FA;
          margin: 0px;
        }
        SPAN.clsMouseDown
        {
          background-color: #EAF3FA;
          color: black;
          border: 1px solid #EAF3FA;
          margin: 0px;
        }
        SPAN.clsCurrentHasFocus
        {
          background-color: #EAF3FA;
          color: black;
          border: 1px solid #B4D9F1;
          margin: 0px;
        }
        span.clsUnavailable
        {
          height: 0px;
          padding: 0px;
          top: 0px;
          border: none;
          color: #888888;
        }
        .hide
        {
          display: none;
        }
        .shown
        {
          display: block;
          margin-left: 15px;
        }

        Table.Grid
        {
          width: 100%;
          table-layout: fixed;
          border-collapse: collapse;
          border-left: 1px solid #6699cc;
          border-right: 1px solid #6699cc;
          border-bottom: 1px solid #6699cc;
        }

        Table.Grid Col
        {
        }

        Table.Grid TH
        {
          color: Black;
          border-left: 1px solid #6699cc;
          border-right: 1px solid #6699cc;
          border-bottom: 1px solid #6699cc;
          background-color: #99CCFF;
          background-image: url(data:image/gif;base64,R0lGODlhAQAUAMQAAEeRxaXP67jc8rDW8J/K6avT7oW23LLY8bba8pHA4pjF5TB8sL3f9ICz2rTZ8Ym63svo+Iu737ze87rd8wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAABABQAAAURIAAx0iQgzjEUAaEkkdE8SwgAOw==);
          padding: 3px;
          font-weight: normal;
          font-size: 11px;
        }

        Table.Grid TD
        {
          color: Black;
          border: 1px solid #D0E5F5;
          padding: 3px;
          white-space: nowrap;
          font-size: 11px;
        }
        Table.Grid TR
        {
          background-color: white;
        }

        Table.Grid TR.even
        {
          background-color: #F2F8FC;
        }

    </style>
            
    <style type='text/css'>
        TABLE.clsBorder TH { border: 1px solid #4791C5; background-color: #1CD4C6; }
        TABLE.clsBorderTop TH { border: 1px solid #4791C5; background-color: #1CD4C6; }
        TABLE.clsBorderTop TH TH { border: none; }
        H5 {PAGE-BREAK-AFTER: always;}
    </style>

        </head>
        <body id='MainBody' scroll='yes' topmargin='0' leftmargin='0' rightmargin='0' >
            <div id='orders' class='scrollWindow' align='center' >
                  <center>
<table border="0" cellpadding="0" cellspacing="0" width="90%"><tr><td><table cellpadding="0" cellspacing="0" width="100%"><tr><td><p><img src="https://farm1.staticflickr.com/792/27504604888_bfdc331455_m.jpg" /></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p></td></tr><tr><td>1</td></tr><tr></tr></table></td></tr><tr><td><table border="0" cellpadding="4" cellspacing="0" width="100%" class="clsBorderTop"><tr><th align="left" nowrap width="33%"><table cellpadding="0" cellspacing="0" width="100%"><tr><th align="left"><font color="Black">ORDER INFO</font></th></tr></table></th></tr><tr><td valign="Top"><table><tr><td valign="top" nowrap><font color="black">Name:</font><BR><font color="black">Billed:</font><BR><font color="black">Order Number:</font><BR><font color="black">Last Run Date:</font><BR><font color="black">Next Run Date:</font><BR><font color="black"></font><BR></td><td valign="top" nowrap class="clsText">Alexis  Angres<br><br><br><br><br><br></td></tr></table></td></tr></table><table border="0" cellpadding="4" cellspacing="0" width="100%" class="clsBorder"><tr><th align="left" nowrap ><font color="Black">Payment Info</font></th></tr><tr><td><BR>&nbsp;</td></tr></table><table border="0" cellpadding="4" cellspacing="0" width="100%" class="clsBorder"><tr><th  align="left" nowrap style="width:" ><font color="Black">Qty</font></th><th  align="left" nowrap style="width:" ><font color="Black">Item</font></th><th  align="left" nowrap style="width:" ><font color="Black">Description</font></th><th  align="right" nowrap style="width:" ><font color="Black">Total</font></th></tr><tr><td class="clsText" align="left" valign=top><font color="Black">1</font></td><td class="clsText" align="left" valign=top><font color="Black">B181118</font></td><td class="clsText" align="left" valign=top><font color="Black">(B) Family Rules                      </font></td><td class="clsText" align="right" valign=top><font color="Black">$9.99</font></td></tr></table><div align="right"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td valign="top" align="left" width="70%" valign="top"></td><td valign="top" align="right" width="40%"><table border="0" cellpadding="4" cellspacing="0" width="100%"><tr><td align="right" nowrap><font color="Black">Subtotal:</font></td><td align="right" class="clsText">$9.99</td></tr><tr><td align="right" nowrap><font color="Black">Taxes:</font></td><td align="right" class="clsText">$0.00</td></tr><tr><td align="right" nowrap><font color="Black"><b>Total:</b></font></td><td align="right" class="clsText"><b>$9.99</b></td></tr></table></td></tr></table></div></td></tr><tr><td><p><span style="font-family: georgia, palatino, serif;"><span style="font-family: verdana, geneva, sans-serif; color: #999999;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span></span></p>
<p>&nbsp;</p>
<p><span style="font-family: georgia, palatino, serif;"><span style="font-family: verdana, geneva, sans-serif; color: #999999;"><span style="font-size: 18pt; color: #a7a9ac;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; happy chalking!&nbsp;</span></span></span></p>
<p>&nbsp;</p>
<p><span style="font-family: verdana, geneva, sans-serif;"><span style="font-family: 'trebuchet ms', geneva, sans-serif; color: #b9bbbd;"><span style="color: #a7a9ac;">Designer&nbsp;Services (844) 673-6316&nbsp;</span>&nbsp;&nbsp; &nbsp; &nbsp;</span>&nbsp;&nbsp;</span>&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p></td></tr></table><BR></table><BR>
    </center></div>
        <script type='text/javascript'>
            window.document.body.scroll='yes';
        </script>
    </body>
</html>`;
    return (
      <Container>
        <View style={{ padding: 10 }} />
        <Header style={{ backgroundColor: "#778899" }}>
          <Left style={{ flex: 1 }}>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("Order")}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Resend Invoice</Title>
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
            <HTMLView value={htmlContent} />
            <Card>
              <CardItem header>
                <Text>Order Number</Text>
                <Text>12345</Text>
              </CardItem>
            </Card>
            <Card>
              <CardItem header>
                <Left>
                  <Text>Order Number</Text>
                </Left>
                <Right>
                  <Text>12345</Text>
                </Right>
              </CardItem>
              <CardItem header>
                <Left>
                  <Text>Date</Text>
                </Left>
                <Right>
                  <Text>12/3/18</Text>
                </Right>
              </CardItem>
              <CardItem header>
                <Left>
                  <Text>Email</Text>
                </Left>
                <Right>
                  <Text>Wilma@mail.com</Text>
                </Right>
              </CardItem>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#cccccc",
                  justifyContent: "space-around",
                  width: deviceWidth,
                  height: 75,
                  backgroundColor: "#cccccc"
                }}
              >
                <View style={styles.box}>
                  <Text>SKU</Text>
                </View>
                <View style={styles.box}>
                  <Text style={{ flex: 1, flexWrap: "wrap" }}>Description</Text>
                </View>
                <View style={styles.box}>
                  <Text>Quantity</Text>
                </View>
                <View style={styles.box}>
                  <Text style={{ flex: 1, flexWrap: "wrap" }}>
                    Price per unit
                  </Text>
                </View>
                <View style={styles.box}>
                  <Text>Total</Text>
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.box}>
                  <Text>B18352</Text>
                </View>
                <View style={styles.box}>
                  <Text>(B) Mini Holiday Icon</Text>
                </View>
                <View style={styles.box}>
                  <Text>1</Text>
                </View>
                <View style={styles.box}>
                  <Text>$8.99</Text>
                </View>
                <View style={styles.box}>
                  <Text>$8.99</Text>
                </View>
                <View style={styles.box}>
                  <Text>303352</Text>
                </View>
                <View style={styles.box}>
                  <Text>(S) Aiden Black</Text>
                </View>
                <View style={styles.box}>
                  <Text>1</Text>
                </View>
                <View style={styles.box}>
                  <Text>$8.99</Text>
                </View>
                <View style={styles.box}>
                  <Text>$8.99</Text>
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.box}>
                  <Text>303352</Text>
                </View>
                <View style={styles.box}>
                  <Text>(S) Aiden Black</Text>
                </View>
                <View style={styles.box}>
                  <Text>1</Text>
                </View>
                <View style={styles.box}>
                  <Text>$8.99</Text>
                </View>
                <View style={styles.box}>
                  <Text>$8.99</Text>
                </View>
              </View>
            </Card>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                margin: 10
              }}
            >
              <Button bordered style={{ backgroundColor: "#00ffff" }}>
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: 20,
                    fontWeight: "bold"
                  }}
                >
                  Resend Invoice
                </Text>
              </Button>

              <Button bordered style={{ backgroundColor: "#00ffff" }}>
                <TouchableOpacity onPress={this._toggleModal}>
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 20,
                      fontWeight: "bold"
                    }}
                  >
                    Change Email
                  </Text>
                </TouchableOpacity>
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              {/* <TouchableOpacity onPress={this._toggleModal}>
                <Text>Show Modal</Text>
              </TouchableOpacity> */}
              <Modal
                isVisible={this.state.isModalVisible}
                style={{
                  width: deviceWidth,
                  height: 40,
                  backgroundColor: "#ffffff"
                }}
              >
                <View style={{ flex: 1 }}>
                  <Item stackedLabel>
                    <Label>Email</Label>
                    <Input placeholder="Enter Email" />
                  </Item>
                  <TouchableOpacity onPress={this._toggleModal}>
                    <Text> Close</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // justifyContent:'space-around',
    //flexWrap: "wrap",
    // height: 300,
    alignItems: "center"
  },
  box: {
    height: 75,
    width: deviceWidth / 5,
    // backgroundColor: "lime",
    borderWidth: 1,
    borderColor: "#d9d9d9"
  }
});
