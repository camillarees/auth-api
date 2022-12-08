'use strict';

const express = require('express');
const dataModules = require('../auth/models');
const bearer = require('../auth/middleware/bearer.js');
const permissions = require('../auth/middleware/acl.js');

const router = express.Router();

router.get('/:model', bearer, handleGetAll);
router.get('/:model/:id', bearer, handleGetOne);
router.post('/:model', bearer, permissions('create'), handleCreate);
router.put('/:model/:id', bearer, permissions('update'), handleUpdate);
router.patch('/:model/id', bearer, permissions('update'), handleUpdate);
router.delete('/:model/:id', bearer, permissions('delete'), handleDelete);

router.param('model', (req, res, next) => {
    const modelName = req.params.model;
    if (dataModules[modelName]) {
        req.model = dataModules[modelName];
        next();
    } else {
        next('Invalid Model');
    }
});

async function handleGetAll(req, res) {
    try {
        let allRecords = await req.model.get();
        res.status(200).json(allRecords);
    } catch (e) {
        console.error('getAll error', e);
    }
}

async function handleGetOne(req, res) {
    try {
        const id = req.params.id;
        let theRecord = await req.model.get(id)
        res.status(200).json(theRecord);
    } catch (e) {
        console.error('getOne error', e);
    }
}

async function handleCreate(req, res) {
    try {
        let obj = req.body;
        let newRecord = await req.model.create(obj);
        res.status(201).json(newRecord);
    } catch (e) {
        console.error('handle create error', e);
    }
}

async function handleUpdate(req, res) {
    try {
        const id = req.params.id;
        const obj = req.body;
        let updatedRecord = await req.model.update(id, obj)
        res.status(200).json(updatedRecord);
    } catch (e) {
        console.error('handle update error', e);
    }
}

async function handleDelete(req, res) {
    try {
        let id = req.params.id;
        let deletedRecord = await req.model.delete(id);
        res.status(200).json(deletedRecord);
        console.log('item deleted');
    } catch (e) {
        console.error(e);
    }
}


module.exports = router;