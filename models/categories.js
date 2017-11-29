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
module.exports.getCategories = function (callback, limit) {
    categories.find(callback).limit(limit);
}

module.exports.getCategoriesById = function (id, callback) {
    categories.findById(id, callback);
}

module.exports.addCategories = function (category, callback) {
    categories.create(category, callback);
}

module.exports.updateCategories = function (id, category, options, callback) {
    var query = { _id: id };
    var update = {
        categoryName: category.categoryName,
        categoryDescription: category.categoryDescription
    }
    categories.findOneAndUpdate(query, update, options, callback);
}

module.exports.deleteCategories = function (id, callback) {
    var query = { _id: id };
    categories.remove(query, callback);
}