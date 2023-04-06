const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const moduleSchema = mongoose.Schema(
  {
    moduleCode: { type: String, required: true },
    companyCode: { type: String, required: true },
    adminUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    viewOnlyUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    defaultWorkFlow: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkFlow', required: true },
    subModules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubModule', required: true }],
    summary: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ModuleSummary', required: true }],
    status: { type: Boolean, required: true, default: true }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
moduleSchema.plugin(toJSON);

/**
 * @typedef Module
 */
const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
