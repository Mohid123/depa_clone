const httpStatus = require('http-status');
const { WorkFlow, WorkflowStep } = require('../models');
const ApiError = require('../utils/ApiError');
const workFlowStepService = require('./workFlowStep.service');

/**
 * Create a WorkFlow
 * @param {Object} workFlowBody
 * @returns {Promise<WorkFlow>}
 */
const createWorkFlow = async (workFlowBody) => {
  const steps = await WorkflowStep.insertMany(workFlowBody.steps);

  return WorkFlow.create({
    "stepIds": steps.map(({ _id }) => _id)
  });
};

/**
 * Query for WorkFlows
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWorkFlows = async (filter, options) => {
  const WorkFlows = await WorkFlow.paginate(filter, options);
  return WorkFlows;
};

/**
 * Get WorkFlow by id
 * @param {ObjectId} id
 * @returns {Promise<WorkFlow>}
 */
const getWorkFlowById = async (id) => {
  return WorkFlow.findById(id).populate({
    path: 'stepIds',
    populate: {
      path: 'approverIds'
    }
  });
};

/**
 * Update WorkFlow by id
 * @param {ObjectId} workFlowId
 * @param {Object} updateBody
 * @returns {Promise<WorkFlow>}
 */
const updateWorkFlowById = async (workFlowId, updateBody) => {
  const workFlow = await getWorkFlowById(workFlowId);
  if (!workFlow) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WorkFlow not found');
  }

  // const workFlowStepIdsArr = workFlow.stepIds.map(({ _id }) => _id);
  // const updateBodyStepIdsArr = updateBody.steps.map(({ id }) => id).filter((val) => val != null);

  let workflowStep = null; // initialize here
  for (const step of updateBody.steps) {
    if (step.id) {
      const stepId = step.id;
      delete step.id;

      workflowStep = await workFlowStepService.updateWorkflowStepById(stepId, step);

    } else {
      const { _id } = await workFlowStepService.createWorkflowStep(step);
      const stepIds = [...workFlow.stepIds, _id];
      Object.assign(workFlow, { 'stepIds': stepIds });
      await workFlow.save();
    }
  }

  return await getWorkFlowById(workFlowId);
};

/**
 * Delete WorkFlow by id
 * @param {ObjectId} workFlowId
 * @returns {Promise<WorkFlow>}
 */
const deleteWorkFlowById = async (workFlowId) => {
  const workFlow = await getWorkFlowById(workFlowId);
  if (!workFlow) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WorkFlow not found');
  }
  await workFlow.remove();
  return workFlow;
};

module.exports = {
  createWorkFlow,
  queryWorkFlows,
  getWorkFlowById,
  updateWorkFlowById,
  deleteWorkFlowById,
};
