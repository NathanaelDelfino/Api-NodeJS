'user strict'
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

mongoose.connect('mongodb+srv://balta:balta@ndstr-8vwdy.gcp.mongodb.net/test?retryWrites=true&w=majority');

//Carrega os Modelos
const Product = require('./models/product');


//Carrega as Rotas
const index = require('./routes/index-route');
const products = require('./routes/product-route');

app.use('/', index);
app.use('/products', products);


module.exports = app;