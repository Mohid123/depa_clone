const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const { defaultFields } = require('./index');

const categorySchema = mongoose.Schema(
  Object.assign(
    {},
    defaultFields,
    {
      name: { type: String, required: true },
    }
  )
);

// add plugin that converts mongoose to json
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

/**
 * Check if name is taken
 * @param {string} name - The user's name
 * @param {ObjectId} [excludeCategoryId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
categorySchema.statics.isNameTaken = async function (name, excludeCategoryId) {
  const category = await this.findOne({ name, _id: { $ne: excludeCategoryId } });
  return !!category;
};

/**
 * Custom method to perform soft delete
 * 
 * @returns {Promise<boolean>}
 */
categorySchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

/**
 * Method to remove documents from the trash
 * 
 * @returns {Promise<boolean>}
 */
categorySchema.statics.removeFromTrash = function () {
  return this.deleteMany({ isDeleted: true });
};

/**
 * Static method to retrieve only non-Deleted documents
 * 
 * @returns {Promise<boolean>}
 */
categorySchema.statics.findWithoutTrashed = function () {
  return this.find({ isDeleted: false });
};

/**
 * @typedef Category
 */
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
