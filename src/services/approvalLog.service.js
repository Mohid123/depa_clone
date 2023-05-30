const httpStatus = require('http-status');
const { ApprovalLog } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a ApprovalLog
 * @param {Object} approvalLogBody
 * @returns {Promise<ApprovalLog>}
 */
const createApprovalLog = async (approvalLogBody) => {
  return ApprovalLog.create(approvalLogBody);
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
  const approvalLogs = await ApprovalLog.paginate(filter, options);
  return approvalLogs;
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
  const approvalLog = await getApprovalLogById(approvalLogId);
  if (!approvalLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ApprovalLog not found');
  }

  Object.assign(approvalLog, updateBody);
  await approvalLog.save();
  return approvalLog;
};

/**
 * Delete ApprovalLog by id
 * @param {ObjectId} approvalLogId
 * @returns {Promise<ApprovalLog>}
 */
const deleteApprovalLogById = async (approvalLogId) => {
  const approvalLog = await getApprovalLogById(approvalLogId);
  if (!approvalLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ApprovalLog not found');
  }
  await approvalLog.softDelete();
  return approvalLog;
};

module.exports = {
  createApprovalLog,
  queryApprovalLogs,
  getApprovalLogById,
  updateApprovalLogById,
  deleteApprovalLogById,
};
