const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');
const { defaultFields } = require('./index');

const companySchema = mongoose.Schema(
  Object.assign(
    {},
    defaultFields,
    {
      groupCode: { type: String, required: true },
      title: { type: String, required: true },
    }
  )
);

// add plugin that converts mongoose to json
companySchema.plugin(toJSON);

/**
 * @typedef Company
 */
const Company = mongoose.model('Company', companySchema);

module.exports = Company;
