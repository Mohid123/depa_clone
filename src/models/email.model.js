const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const emailSchema = mongoose.Schema(
  {
    code: {
      type: String, unique: true, required: true,
      default: () => Math.random().toString(36).slice(2) // generates a random 10-character alphanumeric string as the default value for uid
    },
    subject: { type: String, required: true },
    to: { type: String, required: true },
    cc: { type: String, required: true },
    bcc: { type: String, required: true },
    emailStatus: { type: String, required: true },
    redirectionalUrl: { type: String, required: true },
    bodyWithAction: { type: String, required: true },
    bodyWithoutAction: { type: String, required: true },
    data: {
      formTitle: { type: String, required: true },
      formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    },
    approvalLogId: { type: mongoose.Schema.Types.ObjectId, ref: 'ApprovalLog', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    subModuleId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubModule', required: true },
    moduleName: { type: String, required: true },
    emailResponseId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkFlowSetp', required: true },
    emailResponseBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    emailResponseBody: { type: String, required: true },
    activityLogPerformWRTER: { type: String, required: true },

    revisionNo: { type: Number, default: 0, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now, required: true },
    status: { type: Number, default: 1, required: true },
  }
);

// add plugin that converts mongoose to json
emailSchema.plugin(toJSON);

/**
 * @typedef Email
 */
const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
