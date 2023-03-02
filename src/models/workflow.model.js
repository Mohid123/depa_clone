const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const workFlowSchema = mongoose.Schema(
  {
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
          enum: ["none","and","or"],
          default: "none"
        },
      	approverIds: [{ 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'User',
        }], // Reference to User document _id
    }],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
workFlowSchema.plugin(toJSON);

/**
 * @typedef WorkFlow
 */
const WorkFlow = mongoose.model('WorkFlow', workFlowSchema);

module.exports = WorkFlow;
