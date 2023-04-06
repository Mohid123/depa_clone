const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const workFlowSchema = mongoose.Schema(
  {
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
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
workFlowSchema.plugin(toJSON);

/**
 * @typedef WorkFlow
 */
const WorkFlow = mongoose.model('WorkFlow', workFlowSchema);

module.exports = WorkFlow;
