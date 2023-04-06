const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const workflowStepSchema = mongoose.Schema(
  {
    type: {  type: String, enum: ["none","and","or"] },
    approverIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
workflowStepSchema.plugin(toJSON);

/**
 * @typedef WorkflowStep
 */
const WorkflowStep = mongoose.model('WorkflowStep', workflowStepSchema);

module.exports = WorkflowStep;
