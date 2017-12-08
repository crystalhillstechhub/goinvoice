var express = require('express');
var router = express.Router();
var Product = require('../models/products');

// Get Homepage
router.get('/home', ensureAuthenticated, function(req, res) {
    res.render('index');
});

router.get('/profile', ensureAuthenticated, function(req, res) {
    res.render('profile', { layout: false });
});

router.get('/product', ensureAuthenticated, function(req, res) {
    res.render('addproduct');
});

router.post('/product', function(req, res) {

    var productName = req.body.productName;
    var productCategory = req.body.productCategory;
    var productDescription = req.body.productDescription;
    var productPrice = req.body.productPrice;
    var productQuantity = req.body.productQuantity;
    var expiryDate = req.body.expiryDate;

    // Validation
    req.checkBody('productName', 'Product Name is required').notEmpty();
    req.checkBody('productCategory', 'Product Category is required').notEmpty();
    req.checkBody('productQuantity', 'Product Quantity is required').notEmpty();
    req.checkBody('productPrice', 'Product Price is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.render('addproduct', {
            errors: errors
        });
    } else {
        var newProduct = new Product({
            productName: productName,
            productCategory: productCategory,
            productDescription: productDescription,
            productPrice: productPrice,
            productQuantity: productQuantity,
            expiryDate: expiryDate
        });

        Product.addProducts(newProduct, function(err, product) {
            if (err) throw err;
            console.log(product);
        });

        req.flash('success_msg', 'Product has been added successfully!');

        res.redirect('/product');
    }
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/');
    }
}

module.exports = router;