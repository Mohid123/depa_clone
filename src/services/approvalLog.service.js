const httpStatus = require('http-status');
const { ApprovalLog } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a ApprovalLog
 * @param {Object} ApprovalLogBody
 * @returns {Promise<ApprovalLog>}
 */
const createApprovalLog = async (ApprovalLogBody) => {
  return ApprovalLog.create(ApprovalLogBody);
};

/**
 * Query for ApprovalLogs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryApprovalLogs = async (filter, options) => {
  const ApprovalLogs = await ApprovalLog.paginate(filter, options);
  return ApprovalLogs;
};

/**
 * Get ApprovalLog by id
 * @param {ObjectId} id
 * @returns {Promise<ApprovalLog>}
 */
const getApprovalLogById = async (id) => {
  return ApprovalLog.findById(id);
};

/**
 * Update ApprovalLog by id
 * @param {ObjectId} approvalLogId
 * @param {Object} updateBody
 * @returns {Promise<ApprovalLog>}
 */
const updateApprovalLogById = async (approvalLogId, updateBody) => {
  const ApprovalLog = await getApprovalLogById(approvalLogId);
  if (!ApprovalLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ApprovalLog not found');
  }

  Object.assign(ApprovalLog, updateBody);
  await ApprovalLog.save();
  return ApprovalLog;
};

/**
 * Delete ApprovalLog by id
 * @param {ObjectId} approvalLogId
 * @returns {Promise<ApprovalLog>}
 */
const deleteApprovalLogById = async (approvalLogId) => {
  const ApprovalLog = await getApprovalLogById(approvalLogId);
  if (!ApprovalLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ApprovalLog not found');
  }
  await ApprovalLog.remove();
  return ApprovalLog;
};

module.exports = {
  createApprovalLog,
  queryApprovalLogs,
  getApprovalLogById,
  updateApprovalLogById,
  deleteApprovalLogById,
};
