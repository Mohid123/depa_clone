const httpStatus = require('http-status');
const { WorkflowStep } = require('../models');
const ApiError = require('../utils/ApiError');
const emailNotifyToService = require('./emailNotifyTo.service');

/**
 * Create a WorkflowStep
 * @param {Object} workflowStepBody
 * @returns {Promise<WorkflowStep>}
 */
const createWorkflowStep = async (workflowStepBody) => {
  if (workflowStepBody.emailNotifyTo && workflowStepBody.emailNotifyTo.length > 0) {
    const { _id } = await emailNotifyToService.createEmailNotifyTo(workflowStepBody);
    workflowStepBody.emailNotifyToId = _id;
  }
  return WorkflowStep.create(workflowStepBody);
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
  const workflowSteps = await WorkflowStep.paginate(filter, options);
  return workflowSteps;
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
 * Update WorkflowStep by id
 * @param {ObjectId} workflowStepId
 * @param {Object} updateBody
 * @returns {Promise<WorkflowStep>}
 */
const updateWorkflowStepById = async (workflowStepId, updateBody) => {
  const workflowStep = await getWorkflowStepById(workflowStepId);
  if (!workflowStep) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WorkflowStep not found');
  }

  if (updateBody.emailNotifyTo.length > 0) {
    if (updateBody.emailNotifyToId) {
      await emailNotifyToService.updateEmailNotifyToById(updateBody.emailNotifyToId, updateBody);
    } else {
      const { _id } = await emailNotifyToService.createEmailNotifyTo(updateBody);
      updateBody.emailNotifyToId = _id;
    }
  } else {
    updateBody.emailNotifyToId = null;
  }

  Object.assign(workflowStep, updateBody);
  await workflowStep.save();
  return workflowStep;
};

/**
 * Delete WorkflowStep by id
 * @param {ObjectId} workflowStepId
 * @returns {Promise<WorkflowStep>}
 */
const deleteWorkflowStepById = async (workflowStepId) => {
  const workflowStep = await getWorkflowStepById(workflowStepId);
  if (!workflowStep) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WorkflowStep not found');
  }
  await workflowStep.softDelete();
  return workflowStep;
};

module.exports = {
  createWorkflowStep,
  queryWorkflowSteps,
  getWorkflowStepById,
  updateWorkflowStepById,
  deleteWorkflowStepById,
};
