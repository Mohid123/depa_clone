const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const { defaultFields } = require('./index');

const emailNotifyToSchema = mongoose.Schema(
  Object.assign(
    {},
    defaultFields,
    {
      moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
      subModuleId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubModule' },
      submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission' },
      emailId: { type: mongoose.Schema.Types.ObjectId, ref: 'Email' },
      notifyUsers: [{
        type: String, required: true, trim: true, lowercase: true,
        validate(value) {
          if (!validator.isEmail(value)) {
            throw new Error('Invalid email');
          }
        }
      }],
    }
  )
);

// add plugin that converts mongoose to json
emailNotifyToSchema.plugin(toJSON);
emailNotifyToSchema.plugin(paginate);

/**
 * Custom method to perform soft delete
 * 
 * @returns {Promise<boolean>}
 */
emailNotifyToSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

/**
 * Method to remove documents from the trash
 * 
 * @returns {Promise<boolean>}
 */
emailNotifyToSchema.methods.removeFromTrash = function () {
  this.isDeleted = false;
  return this.save();
};

/**
 * @typedef EmailNotifyTo
 */
const EmailNotifyTo = mongoose.model('EmailNotifyTo', emailNotifyToSchema);

module.exports = EmailNotifyTo;
