const httpStatus = require('http-status');
const { WorkFlow, WorkflowStep } = require('../models');
const ApiError = require('../utils/ApiError');
const workFlowStepService = require('./workFlowStep.service');

/**
 * Create a WorkFlow
 * @param {Object} WorkFlowBody
 * @returns {Promise<WorkFlow>}
 */
const createWorkFlow = async (WorkFlowBody) => {
  const steps = await WorkflowStep.insertMany(WorkFlowBody.steps);

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
 * Get WorkFlow by email
 * @param {string} email
 * @returns {Promise<WorkFlow>}
 */
const getWorkFlowByEmail = async (email) => {
  return WorkFlow.findOne({ email });
};

/**
 * Update WorkFlow by id
 * @param {ObjectId} workFlowId
 * @param {Object} updateBody
 * @returns {Promise<WorkFlow>}
 */
const updateWorkFlowById = async (workFlowId, updateBody) => {
  const WorkFlow = await getWorkFlowById(workFlowId);
  if (!WorkFlow) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WorkFlow not found');
  }

  let workflowStep = null; // initialize here
  for (const step of updateBody.steps) {
    const stepId = step.id;
    delete step.id;

    workflowStep = await workFlowStepService.updateWorkflowStepById(stepId, step);
  }

  return await getWorkFlowById(workFlowId);
};

/**
 * Delete WorkFlow by id
 * @param {ObjectId} workFlowId
 * @returns {Promise<WorkFlow>}
 */
const deleteWorkFlowById = async (workFlowId) => {
  const WorkFlow = await getWorkFlowById(workFlowId);
  if (!WorkFlow) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WorkFlow not found');
  }
  await WorkFlow.remove();
  return WorkFlow;
};

module.exports = {
  createWorkFlow,
  queryWorkFlows,
  getWorkFlowById,
  getWorkFlowByEmail,
  updateWorkFlowById,
  deleteWorkFlowById,
};
