'use strict';

const ValidationContract = require('../validators/fluent-validator')
const repository = require('../repositories/product-repository')

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
        await repository.create(req.body);
        res.status(201).send({
            message: 'Produto cadastrado com sucesso!'
        });
    } catch (e) {
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