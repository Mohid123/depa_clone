const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const workflowStepSchema = mongoose.Schema(
  {
    condition: {  type: String, enum: ["none","and","or"] },
    approverIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    revisionNo: {  type: Number, default: 0, required: true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now, required: true },
    status: { type: Number, default: 1, required: true }, 
  }
);

// add plugin that converts mongoose to json
workflowStepSchema.plugin(toJSON);

/**
 * @typedef WorkflowStep
 */
const WorkflowStep = mongoose.model('WorkflowStep', workflowStepSchema);

module.exports = WorkflowStep;
