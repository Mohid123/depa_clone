const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');
const { defaultFields } = require('./index');

const moduleSchema = mongoose.Schema(
  Object.assign(
    {},
    defaultFields,
    {
      categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
      code: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      url: { type: String, required: true },
      image: { type: String, required: true },
    }
  )
);

// add plugin that converts mongoose to json
moduleSchema.plugin(toJSON);

/**
 * @typedef Module
 */
const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
