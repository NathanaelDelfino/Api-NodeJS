'use strict';

const ValidationContract = require('../validators/fluent-validator')
const repository = require('../repositories/customer-repository')
const md5 = require('md5');
const emailService = require('../services/email-services');
const authService = require('../services/auth-services');

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(400).send(e);
    }
}

exports.authenticate = async (req, res, next) => {

    let contract = new ValidationContract();
    contract.isEmail(req.body.email, 'Email inválido');
    contract.isRequired(req.body.password, 'Verifique a senha');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {

        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        if (!customer) {
            res.status(404).send({
                message: 'Usuário ou senha inválidos!'
            });
        }
        const token = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name
        });

        res.status(201).send({
            token: token,
            data: {
                id: customer._id,
                email: customer.email,
                name: customer.name
            }
        });

    } catch (e) {
        console.log(e);
        res.status(400).send({
            message: 'Usuário ou senha inválidos!'
        });
    }
};



exports.post = async (req, res, next) => {

    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, 'O nome deve ter pelo menos 3 caracteres');
    contract.isEmail(req.body.email, 'Email inválido');
    contract.isRequired(req.body.password, 'Verifique a senha');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        emailService.send(
            req.body.email,
            'Quick Massage - Atendimento Corporativo',
            global.EMAIL_TMPL.replace('{0}', req.body.name)
        );

        res.status(201).send({
            message: 'Cliente cadastrado com sucesso!'
        });
    } catch (e) {
        res.status(400).send({
            message: 'Falha ao cadastrar cliente',
            data: e
        });
    }
};

exports.deleteById = async (req, res, next) => {
    try {
        await repository.deleteById(req.params.id);
        res.status(201).send({
            message: 'Cliente deletado com sucesso!'
        });
    } catch (e) {
        res.status(400).send({
            message: 'Erro ao deletar cliente',
            data: e
        });
    }
};