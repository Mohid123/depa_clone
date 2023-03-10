const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const moduleSchema = mongoose.Schema(
  {
    moduleCode: { 
      type: String, 
      required: true 
    },
    companyCode: { 
      type: String, 
      required: true 
    },
    adminUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    viewOnlyUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    workFlow: {
      name: { 
        type: String, 
        required: true 
      },
      specialCaseUserId: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
      }], // The special case user who can individually approve the workflow
      steps: [{
          name: { 
            type: String, 
            required: true 
          },
          type: {  
            type: String, 
            enum: ["none","and","or"] 
          },
          approverIds: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
          }], // Reference to User document _id
      }],
    },
    approvalStepStatus: [{
      stepId: { 
        type: String,  
        ref: 'ApprovalStep', 
        required: true 
      },
      activeUser: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
      }],
      approvedUserIds: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
      }],
      pendingUserIds: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
      }],
      type: {  
        type: String, 
        enum: ["none","and","or"],
        default: "none"
      },
      status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        required: true,
        default: 'pending' 
      },
      isActive: { 
        type: Boolean,  
        default: false 
      },
    }],
    approvalLog: [{
      step: { 
        type: Number, 
        ref: 'ApprovalStep',
        required: true 
      },
      approvedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
      },
      approvedOn: { 
        type: Date, 
        default: Date.now 
      },
      remarks: { 
        type: String 
      },
    }],
    forms: [{
      title: { 
        type: String, 
        required: true 
      },
      key: { 
        type: String, 
        required: true 
      },
      schema: { 
        type: Object, 
        required: true 
      },
    }],

    isApproved: { 
      type: String, 
      enum: ['inProgress', 'approved', 'rejected'], 
      required: true,
      default: 'inProgress' 
    },
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
