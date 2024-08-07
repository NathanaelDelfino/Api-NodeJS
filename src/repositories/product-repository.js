'use-strict'

const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.get = async () => {
    let res = await Product
        .find({
            active: true
        });
    return res;
}

exports.getBySlug = async (slug) => {
    let res = await Product
        .findOne({
            slug: slug,
            active: true
        }, 'title description slug price tags');
    return res;
}

exports.getById = async (id) => {
    let res = await Product
        .findById(id);
    return res;
}

exports.getByTag = async (tag) => {
    let res = await Product
        .find({
            tags: tag,
            active: true
        }, 'title description slug price tags');
    return res;
}

exports.create = async (data) => {
    var product = new Product(data);
    await product.save();
}

exports.update = async (id, data) => {
    await Product
        .findByIdAndUpdate(id, {
            $set: {
                title: data.title,
                description: data.description,
                price: data.price,
                tags: data.tags
            }
        })
}

exports.deleteById = async (id) => {
    await Product.findByIdAndDelete(id);
}

exports.deleteBySlug = async (slug) => {
    let res = await Product.findOneAndDelete({
        slug: slug
    });
    return res;
}