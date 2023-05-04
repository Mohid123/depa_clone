const httpStatus = require('http-status');
const { FormData } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a FormData
 * @param {Object} FormDataBody
 * @returns {Promise<FormData>}
 */
const createFormData = async (FormDataBody) => {
  return FormData.create(FormDataBody);
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
  const FormsData = await FormData.paginate(filter, options);
  return FormsData;
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
 * Get FormData by email
 * @param {string} email
 * @returns {Promise<FormData>}
 */
const getFormDataByEmail = async (email) => {
  return FormData.findOne({ email });
};

/**
 * Update FormData by id
 * @param {ObjectId} formDataId
 * @param {Object} updateBody
 * @returns {Promise<FormData>}
 */
const updateFormDataById = async (formDataId, updateBody) => {
  const FormData = await getFormDataById(formDataId);
  if (!FormData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'FormData not found');
  }
  Object.assign(FormData, updateBody);
  await FormData.save();
  return FormData;
};

/**
 * Delete FormData by id
 * @param {ObjectId} formDataId
 * @returns {Promise<FormData>}
 */
const deleteFormDataById = async (formDataId) => {
  const FormData = await getFormDataById(formDataId);
  if (!FormData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'FormData not found');
  }
  await FormData.remove();
  return FormData;
};

module.exports = {
  createFormData,
  queryFormsData,
  getFormDataById,
  getFormDataByEmail,
  updateFormDataById,
  deleteFormDataById,
};
