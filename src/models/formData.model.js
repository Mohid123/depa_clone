const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const { defaultFields } = require('./index');

const formDataSchema = mongoose.Schema(
  Object.assign(
    {},
    defaultFields,
    {
      formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
      data: { type: Object, required: true },
    }
  )
);

// add plugin that converts mongoose to json
formDataSchema.plugin(toJSON);
formDataSchema.plugin(paginate);

/**
 * Custom method to perform soft delete
 * 
 * @returns {Promise<boolean>}
 */
formDataSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

/**
 * Method to remove documents from the trash
 * 
 * @returns {Promise<boolean>}
 */
formDataSchema.methods.removeFromTrash = function () {
  this.isDeleted = false;
  return this.save();
};

/**
 * @typedef FormData
 */
const FormData = mongoose.model('FormData', formDataSchema);

module.exports = FormData;
