const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');
const { defaultFields } = require('./index');

const categorySchema = mongoose.Schema(
  Object.assign(
    {},
    defaultFields,
    {
      name: { type: String, required: true },
    }
  )
);

// add plugin that converts mongoose to json
categorySchema.plugin(toJSON);

/**
 * @typedef Category
 */
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
