const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { workFlowStepService } = require('../../services');

const createWorkFlowStep = catchAsync(async (req, res) => {
  const WorkFlowStep = await workFlowStepService.createWorkflowStep(req.body);
  res.status(httpStatus.CREATED).send(WorkFlowStep);
});

const getWorkFlowSteps = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['workFlowStepName', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await workFlowStepService.queryWorkflowSteps(filter, options);
  res.send(result);
});

const getWorkFlowStep = catchAsync(async (req, res) => {
  const WorkFlowStep = await workFlowStepService.getWorkflowStepById(req.params.workFlowStepId);
  if (!WorkFlowStep) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WorkFlowStep not found');
  }
  res.send(WorkFlowStep);
});

const updateWorkFlowStep = catchAsync(async (req, res) => {
  const WorkFlowStep = await workFlowStepService.updateWorkflowStepById(req.params.workFlowStepId, req.body);
  res.send(WorkFlowStep);
});

const deleteWorkFlowStep = catchAsync(async (req, res) => {
  await workFlowStepService.deleteWorkflowStepById(req.params.workFlowStepId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createWorkFlowStep,
  getWorkFlowSteps,
  getWorkFlowStep,
  updateWorkFlowStep,
  deleteWorkFlowStep,
};
