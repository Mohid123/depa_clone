const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const { defaultFields } = require('./index');

const approvalLogSchema = mongoose.Schema(
  Object.assign(
    {},
    defaultFields,
    {
      subModuleId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubModule', required: true },
      submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
      workFlowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workflow', required: true },
      stepId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkflowStep' },
      performedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      approvalStatus: { type: String, enum: ['created', 'inProgress', 'approved', 'rejected'], default: 'inProgress' },
      action: { type: String, enum: ['cancelled', 'deleted'] },
      remarks: { type: String },
      approvedOn: { type: Date },
    }
  )
);

// add plugin that converts mongoose to json
approvalLogSchema.plugin(toJSON);
approvalLogSchema.plugin(paginate);

/**
 * Custom method to perform soft delete
 * 
 * @returns {Promise<boolean>}
 */
approvalLogSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

/**
 * Method to remove documents from the trash
 * 
 * @returns {Promise<boolean>}
 */
approvalLogSchema.methods.removeFromTrash = function () {
  this.isDeleted = false;
  return this.save();
};

/**
 * @typedef ApprovalLog
 */
const ApprovalLog = mongoose.model('ApprovalLog', approvalLogSchema);

module.exports = ApprovalLog;
