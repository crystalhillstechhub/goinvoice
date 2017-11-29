var mongoose = require('mongoose');

//Customer Schema

var customerSchema = mongoose.Schema({
    customerName: {
        type: String,
        require: true
    },

    customerCompanyName: {
        type: String,
        require: true
    },

    customerAddress: {
        type: String,
        require: true
    },

    customerPhone: {
        type: String,
        require: true
    },

    customerEmail: {
        type: String,
        require: true
    },

    create_date: {
        type: Date,
        default: Date.now
    }
});

var customers = module.exports = mongoose.model('customers', categorySchema);

//Get All Customers
module.exports.getCustomers = function (callback, limit) {
    customers.find(callback).limit(limit);
}

module.exports.getCustomersById = function (id, callback) {
    customers.findById(id, callback);
}

module.exports.addCustomers = function (customer, callback) {
    customers.create(customer, callback);
}

module.exports.updateCustomers = function (id, customer, options, callback) {
    var query = { _id: id };
    var update = {
        customeryName: customer.customeryName,
        customerCompanyName: customer.customerCompanyName,
        customerAddress: customer.customerAddress,
        customerPhone: customer.customerPhone,
        customerEmail: customer.customerEmail
    }
    customers.findOneAndUpdate(query, update, options, callback);
}

module.exports.deleteCustomers = function (id, callback) {
    var query = { _id: id };
    customers.remove(query, callback);
}