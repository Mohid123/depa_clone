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
      subModuleId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubModule' },
      summaryData: { type: Object },
      formIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form' }],
      formDataIds: { type: mongoose.Schema.Types.ObjectId, ref: 'FormData' },
      submissionStatus: { type: Number, default: 1, required: true },
      workflow: { type: WorkFlow.schema, required: true },
      workflowStatus: [{
        stepId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkflowStep' },
        activeUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        approvedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        pendingUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        condition: { type: String, enum: ["none", "and", "or"] },
        status: { type: String, enum: ["pending", "approved", "rejected"] },
        isActive: { type: Boolean, default: false },
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
