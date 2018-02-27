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
        }else{
            res.render('addProduct', {products: product});
        }
    });
});


//  API GET REQUEST FOR ONE productS
router.get('/products/:id', ensureAuthenticated, function(req, res) {
    product.getProductsById(req.params._id, function(err, product) {
        if (err) {
            res.send(err);
        }
        else{
            res.render('editProduct', {products: product});    
        }
    });
});

// API POST REQUEST
router.post('/products', ensureAuthenticated, function(req, res, next) {
    var productName = req.body.productName;
    var productCategory = req.body.productCategory;
    var productPrice = req.body.productPrice;
    var productQuantity = req.body.productQuantity;
    var productDescription = req.body.productDescription;
      // Validation
    req.checkBody('productName', 'Product Name is required').notEmpty();
    req.checkBody('productCategory', 'Product Category is required').notEmpty();
    req.checkBody('productPrice', 'Product Price is required').notEmpty();
    req.checkBody('productQuantity', 'Product Price is required').notEmpty();   
    var errors = req.validationErrors();
    if (errors) {
        res.render('addProduct', {
            errors: errors
        });
    }else{
        var newProduct = new product({
            productName: productName,
            productCategory: productCategory,
            productPrice: productPrice,
            productQuantity: productQuantity,
            productDescription: productDescription
        });

        product.addProducts(newProduct, function(err, product) {
            if (err) throw err;
            console.log(product);
        });

        req.flash('success_msg', 'You registered a product');

        res.redirect('/product');
    }
});

// API PUT REQUEST
router.put('/products/edit/:id', ensureAuthenticated, function(req, res, next) {
    var productName = req.body.productName;
    var productCategory = req.body.productCategory;
    var productPrice = req.body.productPrice;
    var productQuantity = req.body.productQuantity;
    var productDescription = req.body.productDescription;
      // Validation
    req.checkBody('productName', 'Product Name is required').notEmpty();
    req.checkBody('productCategory', 'Product Category is required').notEmpty();
    req.checkBody('productPrice', 'Product Price is required').notEmpty();
    req.checkBody('productQuantity', 'Product Price is required').notEmpty();   
    var errors = req.validationErrors();
    if (errors) {
        res.render('editProduct', {
            errors: errors
        });
    }else{
        var update = {
            productName: productName,
            productCategory: productCategory,
            productQuantity: productQuantity,
            productDescription: productDescription,
            productPrice: productPrice,
        };

        product.updateProducts(req.params.id, update, {}, function(err, product) {
            if (err) {
                res.send(err);
            }
            req.flash('success_msg', 'You Updated a product');
            res.redirect('/products/'+req.params.id);
        })
    }
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