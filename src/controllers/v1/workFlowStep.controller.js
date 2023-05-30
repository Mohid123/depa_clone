const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { workFlowStepService } = require('../../services');

const createWorkFlowStep = catchAsync(async (req, res) => {
  req.body.createdBy = req.user.id;
  const workFlowStep = await workFlowStepService.createWorkflowStep(req.body);
  res.status(httpStatus.CREATED).send(workFlowStep);
});

const getWorkFlowSteps = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  if (req.query.withTrash !== "") {
    filter.isDeleted = false;
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await workFlowStepService.queryWorkflowSteps(filter, options);
  res.send(result);
});

const getWorkFlowStep = catchAsync(async (req, res) => {
  const workFlowStep = await workFlowStepService.getWorkflowStepById(req.params.workFlowStepId);
  if (!workFlowStep) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WorkFlowStep not found');
  }
  res.send(workFlowStep);
});

const updateWorkFlowStep = catchAsync(async (req, res) => {
  req.body.updatedBy = req.user.id;
  const workFlowStep = await workFlowStepService.updateWorkflowStepById(req.params.workFlowStepId, req.body);
  res.send(workFlowStep);
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
