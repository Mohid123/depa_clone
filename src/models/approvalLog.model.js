const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const approvalLogSchema = mongoose.Schema(
  {
    workFlowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workflow', required: true },
    stepId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkflowStep', required: true },
    performedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], required: true, default: 'pending' },
    remarks: { type: String },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    subModuleId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubModule', required: true },

    revisionNo: { type: Number, default: 0, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now, required: true },
    status: { type: Number, default: 1, required: true },
  }
);

// add plugin that converts mongoose to json
approvalLogSchema.plugin(toJSON);

/**
 * @typedef ApprovalLog
 */
const ApprovalLog = mongoose.model('ApprovalLog', approvalLogSchema);

module.exports = ApprovalLog;
