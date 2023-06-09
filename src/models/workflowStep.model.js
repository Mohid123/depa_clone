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
      emailNotifyToId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailNotifyTo' },
    }
  )
);

// add plugin that converts mongoose to json
workflowStepSchema.plugin(toJSON);
workflowStepSchema.plugin(paginate);

/**
 * Custom method to perform soft delete
 * 
 * @returns {Promise<boolean>}
 */
workflowStepSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

/**
 * Method to remove documents from the trash
 * 
 * @returns {Promise<boolean>}
 */
workflowStepSchema.methods.removeFromTrash = function () {
  this.isDeleted = false;
  return this.save();
};

/**
 * @typedef WorkflowStep
 */
const WorkflowStep = mongoose.model('WorkflowStep', workflowStepSchema);

module.exports = WorkflowStep;
