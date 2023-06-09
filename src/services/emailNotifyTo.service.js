const httpStatus = require('http-status');
const { EmailNotifyTo } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a EmailNotifyTo
 * @param {Object} emailNotifyTo
 * @returns {Promise<EmailNotifyTo>}
 */
const createEmailNotifyTo = async (emailNotifyTo) => {
  return EmailNotifyTo.create(emailNotifyTo);
};

/**
 * Query for EmailNotifyTos
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryEmailNotifyTos = async (filter, options) => {
  // Adjust the filter to include regex search on name if provided
  if (filter.name) {
    filter.name = { $regex: filter.name, $options: 'i' };
  }

  const emailNotifyTos = await EmailNotifyTo.paginate(filter, options);
  return emailNotifyTos;
};

/**
 * Get EmailNotifyTo by id
 * @param {ObjectId} id
 * @returns {Promise<EmailNotifyTo>}
 */
const getEmailNotifyToById = async (id) => {
  return EmailNotifyTo.findById(id);
};

/**
 * Update EmailNotifyTo by id
 * @param {ObjectId} emailNotifyToId
 * @param {Object} updateBody
 * @returns {Promise<EmailNotifyTo>}
 */
const updateEmailNotifyToById = async (emailNotifyToId, updateBody) => {
  const emailNotifyTo = await getEmailNotifyToById(emailNotifyToId);
  if (!emailNotifyTo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'EmailNotifyTo not found');
  }

  Object.assign(emailNotifyTo, updateBody);
  await emailNotifyTo.save();
  return emailNotifyTo;
};

/**
 * Update a emailNotifyTo
 * @param {Object} emailNotifyToBody
 * @returns {Promise<emailNotifyTo>}
 */
const updateManyemailNotifyTos = async (emailNotifyToBody) => {
  return await emailNotifyTo.insertMany(emailNotifyToBody);
};

/**
 * Delete EmailNotifyTo by id
 * @param {ObjectId} emailNotifyToId
 * @returns {Promise<EmailNotifyTo>}
 */
const deleteEmailNotifyToById = async (emailNotifyToId) => {
  const emailNotifyTo = await getEmailNotifyToById(emailNotifyToId);
  if (!emailNotifyTo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'EmailNotifyTo not found');
  }
  await emailNotifyTo.softDelete();
  return emailNotifyTo;
};

module.exports = {
  createEmailNotifyTo,
  queryEmailNotifyTos,
  getEmailNotifyToById,
  updateEmailNotifyToById,
  deleteEmailNotifyToById,
};
