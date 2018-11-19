//Login URL POST
// export const baseURL = 'http://chalkcoutureapiloginservice-dev.us-west-1.elasticbeanstalk.com/api/';
export const baseURL = 'http://loginservice-dev.us-west-1.elasticbeanstalk.com/api/';
//Customer Profile URL GET
export const custPrflURL = 'http://customerservices-dev.us-west-1.elasticbeanstalk.com/api/customer/GetExigoCustomer/'  //'http://chalkcoutureapicustomerservices-dev.us-west-1.elasticbeanstalk.com/api/Customer/';
// Order URL GET by customer id
export const customerOrderURL = 'http://ccapiorderservice-dev.us-west-1.elasticbeanstalk.com/api/orders/';
//Add Customer Screen
export const add_customerURL = 'http://customerservices-dev.us-west-1.elasticbeanstalk.com/api/customer/CreateCustomer';
//Get List of CUstomers URL
export const getCustomerListURL = 'http://customerservices-dev.us-west-1.elasticbeanstalk.com/api/customer/GetChalkCustomers/';
//Get List of Orders URL
export const getOrdersListURL = 'http://ccapiorderservice-dev.us-west-1.elasticbeanstalk.com/api/orders/OrdersByDesignerID/';
//Get Inventory List 
export const getInventoryListURL = 'http://ccapiorderservice-dev.us-west-1.elasticbeanstalk.com/api/Orders/InventoryByDesignerID/';
//Add Orders 
export const addOrdersUrl = 'http://ccapiorderservice-dev.us-west-1.elasticbeanstalk.com/api/Orders/AddOrder/';
//Get Invoice Details Based on Order Id
export const getInvoiceDetailsByOrderIdUrl = 'http://ccapiorderservice-dev.us-west-1.elasticbeanstalk.com/api/Orders/GetINvoice/'