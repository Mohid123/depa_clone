const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const moduleSchema = mongoose.Schema(
  {
    code: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    image: { type: String, required: true },
    
    revisionNo: {  type: Number, default: 0, required: true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now, required: true },
    status: { type: Number, default: 1, required: true },
  }
);

// add plugin that converts mongoose to json
moduleSchema.plugin(toJSON);

/**
 * @typedef Module
 */
const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
