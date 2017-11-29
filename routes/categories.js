var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

category = require('../models/categories');


// API GET REQUEST FOR ALL CATEGORIES
router.get('/categories', function (req, res, next) {
    category.getCategories(function (err, category) {
        if (err) {
            res.send(err);
        }
        res.json(category);
    });
});

//  API GET REQUEST FOR A CATEGORY
router.get('/categories/:_id', function (req, res) {
    category.getCategoriesById(req.params._id, function (err, category) {
        if (err) {
            res.send(err);
        }
        res.json(category);
    });
});

// API POST REQUEST TO ADD CATEGORY
router.post('/categories', function (req, res, next) {
    var categories = req.body;
    category.addCategories(categories, function (err, categories) {
        if (err) {
            res.send(err);
        }
        res.json(category);
    });
});

// API PUT REQUEST TO UPDATE CATEGORY
router.put('/categories/:_id', function (req, res, next) {
    var id = req.params._id
    var categories = req.body;
    category.updateCategories(id, categories, {}, function (err, categories) {
        if (err) {
            res.send(err);
        }
        res.json(categories);
    });
});

//  API DELETE REQUEST FOR A CATEGORY
router.delete('/categories/:_id', function (req, res) {
    var id = req.params._id
    category.deleteCategories(id, function (err, category) {
        if (err) {
            res.send(err);
        }
        res.json(category);
    });
});

module.exports = router;