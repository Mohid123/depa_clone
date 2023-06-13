const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const WorkFlow = require('./workflow.model');
const { defaultFields } = require('./index');

const submissionSchema = mongoose.Schema(
  Object.assign(
    {},
    defaultFields,
    {
      subModuleId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubModule', required: true },
      summaryData: { type: Object },
      formIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true }],
      formDataIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FormData' }],
      submissionStatus: { type: Number, default: 1, required: true },
      workFlowId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkFlow', required: true },
      workflowStatus: [{
        stepId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkflowStep' },
        condition: { type: String, enum: ["none", "and", "or"], default: "none" },
        allUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        activeUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        approvedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        status: { type: String, enum: ["inProgress", "pending", "approved", "rejected"], default: "pending" },
      }],
      workflowAllUsers: [{
        email: {
          type: String, required: true, trim: true, lowercase: true,
          validate(value) {
            if (!validator.isEmail(value)) {
              throw new Error('Invalid email');
            }
          },
        },
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      }]
    }
  )
);

// add plugin that converts mongoose to json
submissionSchema.plugin(toJSON);
submissionSchema.plugin(paginate);

/**
 * Custom method to perform soft delete
 * 
 * @returns {Promise<boolean>}
 */
submissionSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

/**
 * Method to remove documents from the trash
 * 
 * @returns {Promise<boolean>}
 */
submissionSchema.methods.removeFromTrash = function () {
  this.isDeleted = false;
  return this.save();
};

/**
 * @typedef Submission
 */
const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
