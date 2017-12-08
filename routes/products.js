var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

product = require('../models/products');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/');
    }
}
router.get('/products', ensureAuthenticated, function(req, res) {
    product.getProducts(function(err, product) {
        if (err) {
            res.send(err);
        }
        res.render('addproduct', { products: res.product });

    });

});

// API GET REQUEST FOR ALL productS
router.get('/products', function(req, res, next) {
    product.getProducts(function(err, product) {
        if (err) {
            res.send(err);
        }
        res.json(product);
    });
});

//  API GET REQUEST FOR ONE productS
router.get('/products/:_id', function(req, res) {
    product.getProductsById(req.params._id, function(err, product) {
        if (err) {
            res.send(err);
        }
        res.json(product);
    });
});

// API POST REQUEST
router.post('/products', function(req, res, next) {
    var products = req.body;

    product.addProducts(products, function(err, products) {
        if (err) {
            res.send(err);
        }
        res.json(product);
    });
});

// API PUT REQUEST
router.put('/products/:_id', function(req, res, next) {
    var id = req.params._id
    var products = req.body;
    product.updateProducts(id, products, {}, function(err, products) {
        if (err) {
            res.send(err);
        }
        res.json(products);
    });
});

//  API Delete REQUEST FOR ONE productS
router.delete('/products/:_id', function(req, res) {
    var id = req.params._id
    product.deleteProducts(id, function(err, product) {
        if (err) {
            res.send(err);
        }
        res.json(product);
    });
});

module.exports = router;