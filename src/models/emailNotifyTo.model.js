const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const { defaultFields } = require('./index');

const emailNotifyToSchema = mongoose.Schema(
  Object.assign(
    {},
    defaultFields,
    {
      emailId: { type: mongoose.Schema.Types.ObjectId, ref: 'Email', required: true },
      moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
      subModuleId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubModule', required: true },
      workFlowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workflow', required: true },
      stepId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkflowStep', required: true },
      submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
      stepId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
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
