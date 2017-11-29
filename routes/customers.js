var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

customer = require('../models/customers');


// API GET REQUEST FOR ALL CUSTOMERS
router.get('/customers', function (req, res, next) {
    customer.getCustomers(function (err, customer) {
        if (err) {
            res.send(err);
        }
        res.json(customer);
    });
});

//  API GET REQUEST FOR A CUSTOMER
router.get('/customers/:_id', function (req, res) {
    customer.getCustomersById(req.params._id, function (err, customer) {
        if (err) {
            res.send(err);
        }
        res.json(customer);
    });
});

// API POST REQUEST TO ADD CUSTOMER
router.post('/customers', function (req, res, next) {
    var customers = req.body;
    customer.addCustomers(customer, function (err, customer) {
        if (err) {
            res.send(err);
        }
        res.json(customer);
    });
});

// API PUT REQUEST TO UPDATE CUSTOMER
router.put('/customers/:_id', function (req, res, next) {
    var id = req.params._id
    var customers = req.body;
    customer.updateCustomers(id, customers, {}, function (err, customers) {
        if (err) {
            res.send(err);
        }
        res.json(customers);
    });
});

//  API DELETE REQUEST FOR A CUSTOMER
router.delete('/customers/:_id', function (req, res) {
    var id = req.params._id
    customer.deleteCustomers(id, function (err, customer) {
        if (err) {
            res.send(err);
        }
        res.json(customer);
    });
});

module.exports = router;