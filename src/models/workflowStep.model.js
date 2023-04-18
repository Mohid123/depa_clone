const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const { defaultFields } = require('./index');

const workflowStepSchema = mongoose.Schema(
  Object.assign(
    {},
    defaultFields,
    {
      condition: { type: String, enum: ["none", "and", "or"] },
      approverIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    }
  )
);

// add plugin that converts mongoose to json
workflowStepSchema.plugin(toJSON);
workflowStepSchema.plugin(paginate);

/**
 * @typedef WorkflowStep
 */
const WorkflowStep = mongoose.model('WorkflowStep', workflowStepSchema);

module.exports = WorkflowStep;
