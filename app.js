var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var index = require('./routes/index');
var categories = require('./routes/categories');
var customers = require('./routes/customers');
var products = require('./routes/products');

// //Connect to Mongo DB
mongoose.connect('mongodb://localhost/invoice');
var db = mongoose.connection;


var app = express();


//Body Paser Mw
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', index);
app.use('/api', categories);
app.use('/api', customers);
app.use('/api', products);


var port = 3000;
app.listen(port, function() {
    console.log("Server Started On Port" + port);
})