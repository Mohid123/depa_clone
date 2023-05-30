const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { workFlowService } = require('../../services');

const createWorkFlow = catchAsync(async (req, res) => {
  req.body.createdBy = req.user.id;
  const workFlow = await workFlowService.createWorkFlow(req.body);
  res.status(httpStatus.CREATED).send(workFlow);
});

const getWorkFlows = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  if (req.query.withTrash !== "") {
    filter.isDeleted = false;
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await workFlowService.queryWorkFlows(filter, options);
  res.send(result);
});

const getWorkFlow = catchAsync(async (req, res) => {
  const workFlow = await workFlowService.getWorkFlowById(req.params.workFlowId);
  if (!workFlow) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WorkFlow not found');
  }
  res.send(workFlow);
});

const updateWorkFlow = catchAsync(async (req, res) => {
  req.body.updatedBy = req.user.id;
  const workFlow = await workFlowService.updateWorkFlowById(req.params.workFlowId, req.body);
  res.send(workFlow);
});

const deleteWorkFlow = catchAsync(async (req, res) => {
  await workFlowService.deleteWorkFlowById(req.params.workFlowId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createWorkFlow,
  getWorkFlows,
  getWorkFlow,
  updateWorkFlow,
  deleteWorkFlow,
};
