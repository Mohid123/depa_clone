const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const moduleSummarySchema = mongoose.Schema(
  {
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    subModuleId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubModule', required: true },
    formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    lastActivityBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pendingOn: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    progress: { type: mongoose.Types.Decimal128, required: true, default: 0 }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
moduleSummarySchema.plugin(toJSON);

/**
 * @typedef ModuleSummary
 */
const ModuleSummary = mongoose.model('ModuleSummary', moduleSummarySchema);

module.exports = ModuleSummary;
