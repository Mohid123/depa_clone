const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const { defaultFields } = require('./index');

const formSchema = mongoose.Schema(
  Object.assign(
    {},
    defaultFields,
    {
      title: { type: String, required: true },
      name: { type: String, required: true },
      key: { type: String, required: true },
      schema: { type: Object, required: true },
    }
  )
);

// add plugin that converts mongoose to json
formSchema.plugin(toJSON);
formSchema.plugin(paginate);

/**
 * @typedef Form
 */
const Form = mongoose.model('Form', formSchema);

module.exports = Form;
