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
      workFlowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workflow', required: true },
      stepId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkflowStep', required: true },
      performedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], required: true, default: 'pending' },
      remarks: { type: String },
      companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
      moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
    }
  )
);

// add plugin that converts mongoose to json
approvalLogSchema.plugin(toJSON);
approvalLogSchema.plugin(paginate);

/**
 * @typedef ApprovalLog
 */
const ApprovalLog = mongoose.model('ApprovalLog', approvalLogSchema);

module.exports = ApprovalLog;
