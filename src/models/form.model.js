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
      display: { type: String, required: true },
      key: { type: String, required: true },
      components: [{ type: Object, required: true }],
      permissions: [{
        "options": {
          type: [{
            type: String,
            enum: ["canEdit", "canDelete", "canView", "canSave", "canAdd"]
          }],
          required: true
        },
        "user": { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
      }]
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
 * Custom method to perform soft delete
 * 
 * @returns {Promise<boolean>}
 */
formSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

/**
 * Method to remove documents from the trash
 * 
 * @returns {Promise<boolean>}
 */
formSchema.methods.removeFromTrash = function () {
  this.isDeleted = false;
  return this.save();
};

/**
 * @typedef Form
 */
const Form = mongoose.model('Form', formSchema);

module.exports = Form;
