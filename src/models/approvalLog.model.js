const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const approvalLogSchema = mongoose.Schema(
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
approvalLogSchema.plugin(toJSON);

/**
 * @typedef ApprovalLog
 */
const ApprovalLog = mongoose.model('ApprovalLog', approvalLogSchema);

module.exports = ApprovalLog;
