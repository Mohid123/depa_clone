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
        activeUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        approvedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        pendingUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        condition: { type: String, enum: ["none", "and", "or"], default: "none" },
        status: { type: String, enum: ["inProgress", "pending", "approved", "rejected"], default: "pending" },
      }],
    }
  )
);

// add plugin that converts mongoose to json
submissionSchema.plugin(toJSON);
submissionSchema.plugin(paginate);

/**
 * @typedef Submission
 */
const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
