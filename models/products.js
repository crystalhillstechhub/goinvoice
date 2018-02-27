var mongoose = require('mongoose');


//
var productSchema = mongoose.Schema({
    productName: {
        type: String,
        require: true
    },

    productCategory: {
        type: String,
        require: true
    },

    productDescription: {
        type: String,
        require: true
    },

    productPrice: {
        type: String,
        require: true
    },

    productQuantity: {
        type: String,
        require: true
    },

    productQuantityLeft: {
        type: String,
        require: true
    },

    create_date: {
        type: Date,
        default: Date.now
    }
});

var products = module.exports = mongoose.model('products', productSchema);

//Get All Products
module.exports.getProducts = function(callback, limit) {
    products.find(callback).limit(limit);
}

module.exports.getProductsById = function(id, callback) {
    products.findById(id, callback);
}

module.exports.addProducts = function(product, callback) {
    products.create(product, callback);
}

module.exports.updateProducts = function(id, product, options, callback) {
    var query = { _id: id };
    products.findOneAndUpdate(query, product, options, callback);
}

module.exports.deleteProducts = function(id, callback) {
    var query = { _id: id };
    products.remove(query, callback);
}