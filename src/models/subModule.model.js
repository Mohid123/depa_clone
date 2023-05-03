const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const { defaultFields } = require('./index');

const subModuleSchema = mongoose.Schema(
  Object.assign(
    {},
    defaultFields,
    {
      moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
      companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },

      code: { type: String, required: true },
      adminUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
      viewOnlyUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      formIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true }],
      summarySchema: [{ type: Object, required: true }],
      viewSchema: [{ type: Object, required: true }],
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
 * @typedef SubModule
 */
const SubModule = mongoose.model('SubModule', subModuleSchema);

module.exports = SubModule;
