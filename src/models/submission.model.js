const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');
const WorkFlow = require('./workflow.model');

const submissionSchema = mongoose.Schema(
  {
    subModuleId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubModule' },
    summaryData: { type: Object },
    formIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form' }],
    formDataIds: { type: mongoose.Schema.Types.ObjectId, ref: 'FormData' },
    submissionStatus: { type: Number, default: 1, required: true },
    // workflow: WorkFlow,
    workflowStatus: [{
      stepId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkflowStep' },
      activeUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      approvedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      pendingUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      condition: { type: String, enum: ["none", "and", "or"] },
      status: { type: String, enum: ["pending", "approved", "rejected"] },
      isActive: { type: Boolean, default: false },
    }],

    revisionNo: { type: Number, default: 0, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now, required: true },
    status: { type: Number, default: 1, required: true },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
submissionSchema.plugin(toJSON);

/**
 * @typedef Submission
 */
const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
