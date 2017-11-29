var mongoose = require('mongoose');

//Category Schema

var categorySchema = mongoose.Schema({
    categoryName: {
        type: String,
        require: true
    },

    categoryDescription: {
        type: String,
        require: true
    },

    create_date: {
        type: Date,
        default: Date.now
    }
});

var categories = module.exports = mongoose.model('categories', categorySchema);

//Get All Products
module.exports.getcategories = function (callback, limit) {
    categories.find(callback).limit(limit);
}

module.exports.getcategoriesById = function (id, callback) {
    categories.findById(id, callback);
}

module.exports.addcategories = function (category, callback) {
    categories.create(category, callback);
}

module.exports.updatecategories = function (id, category, options, callback) {
    var query = { _id: id };
    var update = {
        categoryName: category.categoryName,
        categoryDescription: category.categoryDescription
    }
    categories.findOneAndUpdate(query, update, options, callback);
}

module.exports.deletecategories = function (id, callback) {
    var query = { _id: id };
    categories.remove(query, callback);
}