const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const subModuleSchema = mongoose.Schema(
  {
    section: { type: String, required: true },
    WorkFlow: {
        name: { type: String, required: true },
        anyUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        defaultUsers: {
            userIds:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
            type: { type: String, enum: ["none","and","or"], default: "none"}
        },
        finalUsers: {
            userIds:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
            type: { type: String, enum: ["none","and","or"], default: "none"}
        },
        stepIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkflowStep' }]
    },
    approvalStepStatus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ApprovalStepStatus', required: true }],
    approvalLog: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ApprovalLog', required: true }],
    form: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true }],
    achievedScore: { type: mongoose.Types.Decimal128, required: true, default: 0 },
    status: { type: String, enum: ['inProgress', 'approved', 'rejected','declined'], required: true, default: 'inProgress' }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
subModuleSchema.plugin(toJSON);

/**
 * @typedef SubModule
 */
const SubModule = mongoose.model('SubModule', subModuleSchema);

module.exports = SubModule;
