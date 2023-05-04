const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const { defaultFields } = require('./index');

const workFlowSchema = mongoose.Schema(
  Object.assign(
    {},
    defaultFields,
    {
      stepIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkflowStep' }],
    }
  )
);

// add plugin that converts mongoose to json
workFlowSchema.plugin(toJSON);
workFlowSchema.plugin(paginate);

/**
 * @typedef WorkFlow
 */
const WorkFlow = mongoose.model('WorkFlow', workFlowSchema);

module.exports = WorkFlow;
