const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const workFlowSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    stepIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkflowStep' }],

    revisionNo: { type: Number, default: 0, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now, required: true },
    status: { type: Number, default: 1, required: true },
  }
);

// add plugin that converts mongoose to json
workFlowSchema.plugin(toJSON);

/**
 * @typedef WorkFlow
 */
const WorkFlow = mongoose.model('WorkFlow', workFlowSchema);

module.exports = WorkFlow;
