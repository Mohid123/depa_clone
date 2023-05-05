const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { approvalLogService } = require('../../services');

const createApprovalLog = catchAsync(async (req, res) => {
  const ApprovalLog = await approvalLogService.createApprovalLog(req.body);
  res.status(httpStatus.CREATED).send(ApprovalLog);
});

const getApprovalLogs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['approvalLogName', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await approvalLogService.queryApprovalLogs(filter, options);
  res.send(result);
});

const getApprovalLog = catchAsync(async (req, res) => {
  const ApprovalLog = await approvalLogService.getApprovalLogById(req.params.ApprovalLogId);
  if (!ApprovalLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ApprovalLog not found');
  }
  res.send(ApprovalLog);
});

const updateApprovalLog = catchAsync(async (req, res) => {
  const ApprovalLog = await approvalLogService.updateApprovalLogById(req.params.ApprovalLogId, req.body);
  res.send(ApprovalLog);
});

const deleteApprovalLog = catchAsync(async (req, res) => {
  await approvalLogService.deleteApprovalLogById(req.params.ApprovalLogId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createApprovalLog,
  getApprovalLogs,
  getApprovalLog,
  updateApprovalLog,
  deleteApprovalLog,
};
