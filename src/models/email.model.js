const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const emailSchema = mongoose.Schema(
  {
    ApprovalLogId: { type: Number, ref: 'ApprovalLog', required: true },
    companyGroup: { type: String, required: true },
    ModuleName: { type: String, required: true },
    subject: { type: String, required: true },
    to: { type: String, required: true },
    cc: { type: String, required: true },
    bcc: { type: String, required: true },
    data: {
        gid: { type: String, required: true },
        subModuleName: { type: String, required: true },
        subModule: { type: mongoose.Schema.Types.ObjectId, ref: 'SubModule' },
        ApprovalLogId: { type: Number, ref: 'ApprovalLog', required: true },
    },
    bodyAction: { type: String, required: true },
    bodyWithAction: { type: String, required: true },
    redirectionalUrl: { type: String, required: true },
    status: { type: String, enum:['import', 'sent'], required: true },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
emailSchema.plugin(toJSON);

/**
 * @typedef Email
 */
const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
