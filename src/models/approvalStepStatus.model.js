const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const approvalStepStatusSchema = mongoose.Schema(
  {
    stepId: { type: String, ref: 'WorkflowStep', required: true },
    activeUser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    approvedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    pendingUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    type: {  type: String, enum: ["none","and","or"], default: "none"},
    status: { type: String, enum: ['pending', 'approved', 'rejected'],required: true,default: 'pending' },
    isActive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
approvalStepStatusSchema.plugin(toJSON);

/**
 * @typedef ApprovalStepStatus
 */
const ApprovalStepStatus = mongoose.model('ApprovalStepStatus', approvalStepStatusSchema);

module.exports = ApprovalStepStatus;
