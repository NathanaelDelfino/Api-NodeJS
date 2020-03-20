'use-strict'

const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');

exports.get = async () => {
    let res = await Customer
        .find();
    return res;
}

exports.authenticate = async (data) => {
    let res = await Customer
        .findOne({
            email: data.email,
            passaword: data.passaword
        });

    return res;
}

exports.create = async (data) => {
    var customer = new Customer(data);
    await customer.save();
}

exports.deleteById = async (id) => {
    await Customer.findByIdAndDelete(id);
}