const httpStatus = require('http-status');
const { Form, SubModule } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');

/**
 * Create a Form
 * @param {Object} FormBody
 * @returns {Promise<Form>}
 */
const createForm = async (FormBody) => {
  if (await Form.isKeyTaken(FormBody.key)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Form Key already taken');
  }

  const form = await Form.create(FormBody);

  if (FormBody.subModuleId) {
    const subModule = await SubModule.findById(FormBody.subModuleId);
    if (!subModule) {
      throw new ApiError(httpStatus.NOT_FOUND, 'SubModule not found');
    }

    let formIDs = subModule.formIds;

    const objectId = mongoose.Types.ObjectId(form.id);
    formIDs = [...formIDs, objectId];

    subModule.formIds = formIDs;

    await subModule.save();
  }

  return form;
};

/**
 * Create a Form
 * @param {Object} FormBody
 * @returns {Promise<Form>}
 */
const createManyForms = async (FormBody) => {
  for (const form of FormBody) {
    if (await Form.isKeyTaken(form.key)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Form Key already taken');
    }
  }

  const forms = await Form.insertMany(FormBody);
  return forms;
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
 * Update Form by id
 * @param {ObjectId} formId
 * @param {Object} updateBody
 * @returns {Promise<Form>}
 */
const updateFormById = async (formId, updateBody) => {
  const Form = await getFormById(formId);
  if (!Form) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
  }
  Object.assign(Form, updateBody);
  await Form.save();
  return Form;
};

/**
 * Delete Form by id
 * @param {ObjectId} formId
 * @returns {Promise<Form>}
 */
const deleteFormById = async (formId) => {
  const form = await getFormById(formId);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
  }
  await form.remove();
  return form;
};

module.exports = {
  createForm,
  createManyForms,
  queryForms,
  getFormById,
  updateFormById,
  deleteFormById,
};
