'use strict';
var config = require('../config');
const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/product-repository');
const azure = require('azure-storage');
const guid = require('guid');

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(400).send(e);
    }
}

exports.getBySlug = async (req, res, next) => {
    try {
        var data = await repository.getBySlug(req.params.slug);
        res.status(200).send(data);
    } catch (e) {
        res.status(400).send(e);
    }
}

exports.getById = async (req, res, next) => {

    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);

    } catch (e) {
        res.status(400).send(e);
    }

}

exports.getByTag = async (req, res, next) => {
    try {
        var data = await repository.getByTag(req.params.tag);
        res.status(200).send(data);
    } catch (e) {
        res.status(400).send(e);
    }
}

exports.post = async (req, res, next) => {

    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O titulo deve ter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.slug, 3, 'O slug deve ter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.description, 3, 'A descricao deve ter pelo menos 3 caracteres');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        //criar um blob service
        const blobSvc = azure.createBlobService(config.containerConnectionString);

        let filename = guid.raw().toString() + '.jpg';
        let rawdata = req.body.image;
        let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let type = matches[1];
        let buffer = new Buffer(matches[2], 'base64');

        
        await blobSvc.createBlockBlobFromText('product-images', filename, buffer, {
            contentType: type
        }, function (error, result, response) {
            if (error) {
                filename = 'default-product.png'
            }
        });

        await repository.create({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            active: true,
            tags: req.body.tags,
            image: config.containerImages + filename
        });

        //await repository.create(req.body);
        res.status(201).send({
            message: 'Produto cadastrado com sucesso!'
        });
    } catch (e) {
        console.log(e);
        res.status(400).send({
            message: 'Falha ao cadastrar produto',
            data: e
        });
    }
};

exports.put = async (req, res, next) => {
    try {
        await repository.update(req.params.id, req.body);
        res.status(201).send({
            message: 'Produto atualizado com sucesso!'
        });
    } catch (e) {
        res.status(400).send({
            message: 'Falha ao atualizar produto',
            data: e
        });
    }
};

exports.deleteById = async (req, res, next) => {
    try {
        await repository.deleteById(req.params.id);
        res.status(201).send({
            message: 'Produto deletado com sucesso!'
        });
    } catch (e) {
        res.status(400).send({
            message: 'Erro ao deletar produto',
            data: e
        });
    }
};

exports.deleteBySlug = async (req, res, next) => {
    try {
        await repository.deleteBySlug(req.params.slug);
        res.status(200).send({
            message: 'Produto deletado com sucesso!'
        });
    } catch (e) {
        res.status(400).send({
            message: 'Erro ao deletar produto',
            data: e
        });
    }
};