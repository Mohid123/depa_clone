const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
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
companySchema.plugin(paginate);

/**
 * Check if title is taken
 * @param {string} title - The user's title
 * @param {ObjectId} [excludeCompanyId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
companySchema.statics.isTitleTaken = async function (title, excludeCompanyId) {
  const company = await this.findOne({ title, _id: { $ne: excludeCompanyId } });
  return !!company;
};

/**
 * @typedef Company
 */
const Company = mongoose.model('Company', companySchema);

module.exports = Company;
