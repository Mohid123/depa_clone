const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { approvalLogService } = require('../../services');

const createApprovalLog = catchAsync(async (req, res) => {
  req.body.createdBy = req.user.id;
  const approvalLog = await approvalLogService.createApprovalLog(req.body);
  res.status(httpStatus.CREATED).send(approvalLog);
});

const getApprovalLogs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['approvalLogName', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await approvalLogService.queryApprovalLogs(filter, options);
  res.send(result);
});

const getApprovalLog = catchAsync(async (req, res) => {
  const approvalLog = await approvalLogService.getApprovalLogById(req.params.approvalLogId);
  if (!approvalLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ApprovalLog not found');
  }
  res.send(approvalLog);
});

const updateApprovalLog = catchAsync(async (req, res) => {
  req.body.updatedBy = req.user.id;
  const approvalLog = await approvalLogService.updateApprovalLogById(req.paramsaApprovalLogId, req.body);
  res.send(approvalLog);
});

const deleteApprovalLog = catchAsync(async (req, res) => {
  await approvalLogService.deleteApprovalLogById(req.params.approvalLogId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createApprovalLog,
  getApprovalLogs,
  getApprovalLog,
  updateApprovalLog,
  deleteApprovalLog,
};
