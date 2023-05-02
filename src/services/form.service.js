const httpStatus = require('http-status');
const { Form } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Form
 * @param {Object} FormBody
 * @returns {Promise<Form>}
 */
const createForm = async (FormBody) => {
  if (await Form.isKeyTaken(FormBody.key)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Key already taken');
  }

  return Form.create(FormBody);
};

/**
 * Query for Forms
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryForms = async (filter, options) => {
  const Forms = await Form.paginate(filter, options);
  return Forms;
};

/**
 * Get Form by id
 * @param {ObjectId} id
 * @returns {Promise<Form>}
 */
const getFormById = async (id) => {
  return Form.findById(id);
};

/**
 * Get Form by email
 * @param {string} email
 * @returns {Promise<Form>}
 */
const getFormByEmail = async (email) => {
  return Form.findOne({ email });
};

/**
 * Update Form by id
 * @param {ObjectId} FormId
 * @param {Object} updateBody
 * @returns {Promise<Form>}
 */
const updateFormById = async (FormId, updateBody) => {
  const Form = await getFormById(FormId);
  if (!Form) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
  }
  Object.assign(Form, updateBody);
  await Form.save();
  return Form;
};

/**
 * Delete Form by id
 * @param {ObjectId} FormId
 * @returns {Promise<Form>}
 */
const deleteFormById = async (FormId) => {
  const Form = await getFormById(FormId);
  if (!Form) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
  }
  await Form.remove();
  return Form;
};

module.exports = {
  createForm,
  queryForms,
  getFormById,
  getFormByEmail,
  updateFormById,
  deleteFormById,
};
