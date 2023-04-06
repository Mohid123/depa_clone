const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const formSchema = mongoose.Schema(
  {
    subModuleId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubModule' },
    title: { type: String, required: true },
    name: { type: String, required: true },
    key: { type: String, required: true },
    schema: { type: Object, required: true },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
formSchema.plugin(toJSON);

/**
 * @typedef Form
 */
const Form = mongoose.model('Form', formSchema);

module.exports = Form;
