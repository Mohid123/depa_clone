const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const { defaultFields } = require('./index');
const config = require('../config/config.js');

const subModuleSchema = mongoose.Schema(
  Object.assign(
    {},
    defaultFields,
    {
      categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
      companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
      parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubModule', default: null },
      adminUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
      viewOnlyUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      workFlowId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkFlow', required: true },
      formIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true }],

      summarySchema: [{ type: String, required: true }],
      viewSchema: [{ type: Object, required: true }],
      code: { type: String, required: true },
      url: { type: String, required: true },
      title: { type: String },
      description: { type: String },
      image: { type: String, get: attachDomainWithImageUrl },

      accessType: {
        type: String,
        enum: ['disabled', 'anyCreate', 'anyCreateAndModify'],
        default: 'disabled',
      }
    }
  )
);

// add plugin that converts mongoose to json
subModuleSchema.plugin(toJSON);
subModuleSchema.plugin(paginate);

/**
 * Check if code is taken
 * @param {string} code - The user's code
 * @param {ObjectId} [excludeSubModuleId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
subModuleSchema.statics.isCodeTaken = async function (code, excludeSubModuleId) {
  const subModule = await this.findOne({ code, _id: { $ne: excludeSubModuleId } });
  return !!subModule;
};

/**
 * Custom method to perform soft delete
 * 
 * @returns {Promise<boolean>}
 */
subModuleSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

/**
 * Method to remove documents from the trash
 * 
 * @returns {Promise<boolean>}
 */
subModuleSchema.methods.removeFromTrash = function () {
  this.isDeleted = false;
  return this.save();
};

// Accessor (getter) function
function attachDomainWithImageUrl(value) {
  // Capitalize the value and return
  return config.fileServer + value;
}

/**
 * @typedef SubModule
 */
const SubModule = mongoose.model('SubModule', subModuleSchema);

module.exports = SubModule;
