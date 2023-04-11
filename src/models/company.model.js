const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const companySchema = mongoose.Schema(
  {
    groupCode: { type: String, required: true },
    title: { type: String, required: true },
    
    revisionNo: {  type: Number, default: 0, required: true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now, required: true },
    status: { type: Number, default: 1, required: true },
  }
);

// add plugin that converts mongoose to json
companySchema.plugin(toJSON);

/**
 * @typedef Company
 */
const Company = mongoose.model('Company', companySchema);

module.exports = Company;
