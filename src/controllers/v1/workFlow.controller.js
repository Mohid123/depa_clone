const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { workFlowService } = require('../../services');

const createWorkFlow = catchAsync(async (req, res) => {
  const WorkFlow = await workFlowService.createWorkFlow(req.body);
  res.status(httpStatus.CREATED).send(WorkFlow);
});

const getWorkFlows = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['workFlowName', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await workFlowService.queryWorkFlows(filter, options);
  res.send(result);
});

const getWorkFlow = catchAsync(async (req, res) => {
  const WorkFlow = await workFlowService.getWorkFlowById(req.params.workFlowId);
  if (!WorkFlow) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WorkFlow not found');
  }
  res.send(WorkFlow);
});

const updateWorkFlow = catchAsync(async (req, res) => {
  const WorkFlow = await workFlowService.updateWorkFlowById(req.params.workFlowId, req.body);
  res.send(WorkFlow);
});

const deleteWorkFlow = catchAsync(async (req, res) => {
  await workFlowService.deleteWorkFlowById(req.params.WorkFlowId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createWorkFlow,
  getWorkFlows,
  getWorkFlow,
  updateWorkFlow,
  deleteWorkFlow,
};
