const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const formDataSchema = mongoose.Schema(
  {
    formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    data: { type: Object, required: true },

    revisionNo: {  type: Number, default: 0, required: true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now, required: true },
    status: { type: Number, default: 1, required: true },
  }
);

// add plugin that converts mongoose to json
formDataSchema.plugin(toJSON);

/**
 * @typedef FormData
 */
const FormData = mongoose.model('FormData', formDataSchema);

module.exports = FormData;
