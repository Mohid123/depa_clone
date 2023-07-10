const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const { defaultFields } = require('./index');

const emailSchema = mongoose.Schema(
  Object.assign(
    {},
    defaultFields,
    {
      companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
      moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
      subModuleId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubModule', required: true },
      submissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
      workFlowId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkFlow', required: true },
      stepId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkFlowStep', required: true },
      approvalLogId: { type: mongoose.Schema.Types.ObjectId, ref: 'ApprovalLog' },

      code: {
        type: String, unique: true, required: true,
        default: () => Math.random().toString(36).slice(2) // generates a random 10-character alphanumeric string as the default value for uid
      },
      subject: { type: String, required: true },
      actionTo: [{
        type: String, required: true, trim: true, lowercase: true,
        validate(value) {
          if (!validator.isEmail(value)) {
            throw new Error('Invalid email');
          }
        }
      }],
      notifyTo: [{
        type: String, trim: true, lowercase: true,
        validate(value) {
          if (!validator.isEmail(value)) {
            throw new Error('Invalid email');
          }
        }
      }],
      cc: { type: String, required: true },
      bcc: { type: String, required: true },
      // redirectionalUrl: { type: String, required: true },
      bodyWithAction: { type: String, required: true },
      bodyWithoutAction: { type: String, required: true },
      data: { type: Object },
      emailStatus: { type: String, required: true },
      // moduleName: { type: String, required: true },
      // emailResponseId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkFlowSetp', required: true },
      // emailResponseBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      // emailResponseBody: { type: String, required: true },
      // activityLogPerformWRTER: { type: String, required: true },
    }
  )
);

// add plugin that converts mongoose to json
emailSchema.plugin(toJSON);
emailSchema.plugin(paginate);

/**
 * Custom method to perform soft delete
 * 
 * @returns {Promise<boolean>}
 */
emailSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

/**
 * Method to remove documents from the trash
 * 
 * @returns {Promise<boolean>}
 */
emailSchema.methods.removeFromTrash = function () {
  this.isDeleted = false;
  return this.save();
};

/**
 * @typedef Email
 */
const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
