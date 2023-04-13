const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');
const { defaultFields } = require('./index');

const subModuleSchema = mongoose.Schema(
  Object.assign(
    {},
    defaultFields,
    {
      moduleId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
      companyId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }],

      code: { type: String, required: true },
      adminUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
      viewOnlyUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      defaultWorkFlow: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkFlow', required: true },
      formIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true }],
      summarySchema: [{ type: Object, required: true }],
      viewSchema: [{ type: Object, required: true }],
    }
  )
);

// add plugin that converts mongoose to json
subModuleSchema.plugin(toJSON);

/**
 * @typedef SubModule
 */
const SubModule = mongoose.model('SubModule', subModuleSchema);

module.exports = SubModule;
