const mongoose = require('mongoose');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

class ModelHelper {
    constructor(model) {
        this.model = model;
    }

    // create
    async create(data) {
        const doc = new this.Model(data);
        return doc.save();
    }

    // read all
    async getAll(query = {}, options = {}) {
        return this.Model.find(query, null, options);
    }

    // read specific resource
    async get(id) {
        const model = this.Model.findById(id);
        if (!model) {
            throw new ApiError(httpStatus.NOT_FOUND, httpStatus['404_MESSAGE']);
        }

        return model;
    }

    // update
    async update(id, data, options = {}) {
        const model = this.Model.findByIdAndUpdate(id, data, options);
        if (!model) {
            throw new ApiError(httpStatus.NOT_FOUND, httpStatus['404_MESSAGE']);
        }

        return model;
    }

    // delete
    async delete(id) {
        const model = this.Model.findByIdAndDelete(id);
        if (!model) {
            throw new ApiError(httpStatus.NOT_FOUND, httpStatus['404_MESSAGE']);
        }

        return model;
    }
}

module.exports = ModelHelper;
