'user strict'
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config')
const app = express();
//const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

mongoose.connect(config.connectionString);

//Carrega os Modelos
const Product = require('./models/product');
const Custumer = require('./models/customer');
const Order = require('./models/order');

//Carrega as Rotas
const index = require('./routes/index-route');
const products = require('./routes/product-route');
const customer = require('./routes/customer-route');
const order = require('./routes/order-route')

app.use('/', index);
app.use('/products', products);
app.use('/customer', customer);
app.use('/orders', order);

module.exports = app;