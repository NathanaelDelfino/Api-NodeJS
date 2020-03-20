'use strict';
const repository = require('../repositories/order-repository');
const guid = require('guid');
const authService = require('../services/auth-services');

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(400).send(e);
    }
}

exports.post = async (req, res, next) => {
   
    try {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        var data = await authService.decodeToken(token);

        await repository.create({
            customer: data.id,
            number: guid.raw().substring(0, 6),
            items: req.body.items
        });

        res.status(201).send({
            message: 'Pedido criado com sucesso!'
        });
    } catch (e) {
        res.status(400).send({
            message: 'Falha ao criar pedido',
            data: e
        });
    }
};

exports.deleteById = async (req, res, next) => {
    try {
        await repository.deleteById(req.params.id);
        res.status(201).send({
            message: 'Venda deletada com sucesso!'
        });
    } catch (e) {
        res.status(400).send({
            message: 'Erro ao deletar venda',
            data: e
        });
    }
};