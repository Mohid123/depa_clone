const httpStatus = require('http-status');
const { Form, SubModule } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');

/**
 * Create a Form
 * @param {Object} formBody
 * @returns {Promise<Form>}
 */
const validateKeyForm = async (formBody) => {
  if (await Form.isKeyTaken(formBody.key)) {
    return {
      isKeyTaken: true
    }
  }

  return {
    isKeyTaken: false
  }
};

/**
 * Create a Form
 * @param {Object} formBody
 * @returns {Promise<Form>}
 */
const createForm = async (formBody) => {
  if (await Form.isKeyTaken(formBody.key)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Form Key already taken');
  }

  const form = await Form.create(formBody);

  if (formBody.subModuleId) {
    const subModule = await SubModule.findById(formBody.subModuleId);
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
 * @param {Object} formBody
 * @returns {Promise<Form>}
 */
const createManyForms = async (formBody) => {
  const seenKeys = new Set();
  const hasKeyDuplicates = formBody.some(obj => {
    if (seenKeys.has(obj.key)) {
      return true; // Found a duplicate
    }
    seenKeys.add(obj.key);
    return false;
  });

  if (hasKeyDuplicates) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Form Key already taken');
  }


  for (const form of formBody) {
    if (await Form.isKeyTaken(form.key)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Form Key already taken');
    }
  }

  const forms = await Form.insertMany(formBody);
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
  const forms = await Form.paginate(filter, options);
  return forms;
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
 * Get Form by id
 * @param {ObjectId} id
 * @returns {Promise<Form>}
 */
const getFormBySlug = async (key) => {
  return Form.findOne({ key: key });
};

/**
 * Update Form by id
 * @param {ObjectId} formId
 * @param {Object} updateBody
 * @returns {Promise<Form>}
 */
const updateFormById = async (formId, updateBody) => {
  const form = await getFormById(formId);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
  }

  if (await Form.isKeyTaken(updateBody.key, form.id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Form Key already taken');
  }

  Object.assign(form, updateBody);
  await form.save();
  return form;
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
  await form.softDelete();
  return form;
};

module.exports = {
  validateKeyForm,
  createForm,
  createManyForms,
  queryForms,
  getFormById,
  getFormBySlug,
  updateFormById,
  deleteFormById,
};
