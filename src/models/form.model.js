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
      schema: [{ type: Object, required: true }],
    }
  )
);

// add plugin that converts mongoose to json
formSchema.plugin(toJSON);
formSchema.plugin(paginate);

/**
 * Check if Key is taken
 * @param {string} Key - The user's Key
 * @param {ObjectId} [excludeFormId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
formSchema.statics.isKeyTaken = async function (key, excludeFormId) {
  const form = await this.findOne({ key, _id: { $ne: excludeFormId } });
  return !!form;
};

/**
 * @typedef Form
 */
const Form = mongoose.model('Form', formSchema);

module.exports = Form;
