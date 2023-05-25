const httpStatus = require('http-status');
const { FormData } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a FormData
 * @param {Object} formDataBody
 * @returns {Promise<FormData>}
 */
const createFormData = async (formDataBody) => {
  return FormData.create(formDataBody);
};

/**
 * Create a Form
 * @param {Object} FormsDataBody
 * @returns {Promise<Form>}
 */
const createManyFormsData = async (FormsDataBody) => {
  const formsData = await FormData.insertMany(FormsDataBody);
  return formsData;
};

/**
 * Query for FormsData
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the formDataat: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryFormsData = async (filter, options) => {
  const formsData = await FormData.paginate(filter, options);
  return formsData;
};

/**
 * Get FormData by id
 * @param {ObjectId} id
 * @returns {Promise<FormData>}
 */
const getFormDataById = async (id) => {
  return FormData.findById(id);
};

/**
 * Update FormData by id
 * @param {ObjectId} formDataId
 * @param {Object} updateBody
 * @returns {Promise<FormData>}
 */
const updateFormDataById = async (formDataId, updateBody) => {
  const formData = await getFormDataById(formDataId);
  if (!formData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'FormData not found');
  }
  Object.assign(formData, updateBody);
  await formData.save();
  return formData;
};

/**
 * Delete FormData by id
 * @param {ObjectId} formDataId
 * @returns {Promise<FormData>}
 */
const deleteFormDataById = async (formDataId) => {
  const formData = await getFormDataById(formDataId);
  if (!formData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'FormData not found');
  }
  await formData.remove();
  return formData;
};

module.exports = {
  createFormData,
  createManyFormsData,
  queryFormsData,
  getFormDataById,
  updateFormDataById,
  deleteFormDataById,
};
