const httpStatus = require('http-status');
const { WorkflowStep } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a WorkflowStep
 * @param {Object} WorkflowStepBody
 * @returns {Promise<WorkflowStep>}
 */
const createWorkflowStep = async (WorkflowStepBody) => {
  return WorkflowStep.create(WorkflowStepBody);
};

/**
 * Query for WorkflowSteps
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryWorkflowSteps = async (filter, options) => {
  const WorkflowSteps = await WorkflowStep.paginate(filter, options);
  return WorkflowSteps;
};

/**
 * Get WorkflowStep by id
 * @param {ObjectId} id
 * @returns {Promise<WorkflowStep>}
 */
const getWorkflowStepById = async (id) => {
  return WorkflowStep.findById(id);
};

/**
 * Get WorkflowStep by email
 * @param {string} email
 * @returns {Promise<WorkflowStep>}
 */
const getWorkflowStepByEmail = async (email) => {
  return WorkflowStep.findOne({ email });
};

/**
 * Update WorkflowStep by id
 * @param {ObjectId} workflowStepId
 * @param {Object} updateBody
 * @returns {Promise<WorkflowStep>}
 */
const updateWorkflowStepById = async (workflowStepId, updateBody) => {
  const WorkflowStep = await getWorkflowStepById(workflowStepId);
  if (!WorkflowStep) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WorkflowStep not found');
  }

  Object.assign(WorkflowStep, updateBody);
  await WorkflowStep.save();
  return WorkflowStep;
};

/**
 * Delete WorkflowStep by id
 * @param {ObjectId} workflowStepId
 * @returns {Promise<WorkflowStep>}
 */
const deleteWorkflowStepById = async (workflowStepId) => {
  const WorkflowStep = await getWorkflowStepById(workflowStepId);
  if (!WorkflowStep) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WorkflowStep not found');
  }
  await WorkflowStep.remove();
  return WorkflowStep;
};

module.exports = {
  createWorkflowStep,
  queryWorkflowSteps,
  getWorkflowStepById,
  getWorkflowStepByEmail,
  updateWorkflowStepById,
  deleteWorkflowStepById,
};
