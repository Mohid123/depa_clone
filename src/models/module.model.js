const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const { defaultFields } = require('./index');

const moduleSchema = mongoose.Schema(
  Object.assign(
    {},
    defaultFields,
    {
      categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
      defaultWorkFlow: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkFlow', required: true },
      code: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      url: { type: String, required: true },
      image: { type: String, required: true },
    }
  )
);

// add plugin that converts mongoose to json
moduleSchema.plugin(toJSON);
moduleSchema.plugin(paginate);

/**
 * Check if code is taken
 * @param {string} code - The user's code
 * @param {ObjectId} [excludeModuleId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
moduleSchema.statics.isCodeTaken = async function (code, excludeModuleId) {
  const module = await this.findOne({ code, _id: { $ne: excludeModuleId } });
  return !!module;
};

/**
 * @typedef Module
 */
const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
