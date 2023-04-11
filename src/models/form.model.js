const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const formSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    name: { type: String, required: true },
    key: { type: String, required: true },
    schema: { type: Object, required: true },

    revisionNo: {  type: Number, default: 0, required: true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now, required: true },
    status: { type: Number, default: 1, required: true },
  }
);

// add plugin that converts mongoose to json
formSchema.plugin(toJSON);

/**
 * @typedef Form
 */
const Form = mongoose.model('Form', formSchema);

module.exports = Form;
