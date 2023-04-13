const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');
const { defaultFields } = require('./index');

const emailNotifyToSchema = mongoose.Schema(
  Object.assign(
    {},
    defaultFields,
    {
      moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
      subModuleId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubModule', required: true },
      workFlowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workflow', required: true },
      stepId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkflowStep', required: true },
    }
  )
);

// add plugin that converts mongoose to json emailNotifyToSchema.plugin(toJSON);

/**
 * @typedef EmailNotifyTo
 */
const EmailNotifyTo = mongoose.model('EmailNotifyTo', emailNotifyToSchema);

module.exports = EmailNotifyTo;
