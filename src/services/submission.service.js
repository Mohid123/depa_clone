const httpStatus = require('http-status');
const { Submission, WorkflowStep } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Submission
 * @param {Object} submissionBody
 * @returns {Promise<Submission>}
 */
const createSubmission = async (submissionBody) => {
  // submissionBody.workflowStatus = [{
  //   stepId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkflowStep' },
  //   activeUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  //   approvedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  //   pendingUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  //   condition: { type: String, enum: ["none", "and", "or"] },
  //   status: { type: String, enum: ["none","pending", "approved", "rejected"] },
  // }];

  const workflowStatusArray = [];
  for (let index = 0; index < submissionBody.workflow.stepIds.length; index++) {
    const element = submissionBody.workflow.stepIds[index];
    let step = await WorkflowStep.findById(element);
    let aproverIdsArray = step.approverIds;
    let stepStatusData = {
      stepId: element,
      activeUserIds: [aproverIdsArray[0]],
      approvedUserIds: [],
      pendingUserIds: aproverIdsArray.length > 1 ? aproverIdsArray.slice(1) : [],
      condition: step.condition,
    };

    stepStatusData.status = (index === 0) ? "inProgress" : "pending";

    workflowStatusArray.push(stepStatusData);
  }

  submissionBody.workflowStatus = workflowStatusArray;
  return Submission.create(submissionBody);
};

/**
 * Query for Submissions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the Submissionat: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySubmissions = async (filter, options) => {
  const submissions = await Submission.paginate(filter, options);
  return submissions;
};

/**
 * Get Submission by id
 * @param {ObjectId} id
 * @returns {Promise<Submission>}
 */
const getSubmissionById = async (id) => {
  return Submission.findById(id);
};

/**
 * Get Submission by email
 * @param {string} email
 * @returns {Promise<Submission>}
 */
const getSubmissionByEmail = async (email) => {
  return Submission.findOne({ email });
};

/**
 * Update Submission by id
 * @param {ObjectId} submissionId
 * @param {Object} updateBody
 * @returns {Promise<Submission>}
 */
const updateSubmissionById = async (submissionId, updateBody) => {
  const Submission = await getSubmissionById(submissionId);
  if (!Submission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Submission not found');
  }
  Object.assign(Submission, updateBody);
  await Submission.save();
  return Submission;
};

/**
 * Delete Submission by id
 * @param {ObjectId} submissionId
 * @returns {Promise<Submission>}
 */
const deleteSubmissionById = async (submissionId) => {
  const Submission = await getSubmissionById(submissionId);
  if (!Submission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Submission not found');
  }
  await Submission.remove();
  return Submission;
};

module.exports = {
  createSubmission,
  querySubmissions,
  getSubmissionById,
  getSubmissionByEmail,
  updateSubmissionById,
  deleteSubmissionById,
};
