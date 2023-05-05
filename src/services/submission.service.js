const httpStatus = require('http-status');
const { Submission, WorkflowStep, User, ApprovalLog } = require('../models');
const ApiError = require('../utils/ApiError');
const workFlowService = require('./workFlow.service');
const approvalLogService = require('./approvalLog.service');

/**
 * Create a Submission
 * @param {Object} submissionBody
 * @returns {Promise<Submission>}
 */
const createSubmission = async (submissionBody) => {
  const workFlow = await workFlowService.createWorkFlow(submissionBody);
  submissionBody.workFlowId = workFlow._id;
  delete submissionBody.steps;

  const workflowStatusArray = [];
  for (let index = 0; index < workFlow.stepIds.length; index++) {
    const element = workFlow.stepIds[index];
    let step = await WorkflowStep.findById(element);
    let aproverIdsArray = step.approverIds;
    if (step.condition == 'or') {

    }
    let stepStatusData = {
      stepId: element,
      allUserIds: aproverIdsArray,
      activeUserIds: (step.condition == 'and') ? [aproverIdsArray[0]] : aproverIdsArray,
      approvedUserIds: [],
      pendingUserIds: (step.condition == 'and') ? aproverIdsArray.slice(1) : [],
      condition: step.condition,
    };

    stepStatusData.status = (index === 0) ? "inProgress" : "pending";

    workflowStatusArray.push(stepStatusData);
  }

  submissionBody.summaryData = {
    progress: 0,
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
const querySubmissions = async (filter, options, getBody) => {
  if (filter.subModuleId) {
    return await Submission.find(filter);
  }

  const submissions = await Submission.paginate(filter, options);
  return submissions;
};

/**
 * Get Submission by id
 * @param {ObjectId} id
 * @returns {Promise<Submission>}
 */
const getSubmissionById = async (id) => {
  const submission = await Submission.findById(id).populate(['formIds', {
    path: 'workFlowId',
    populate: {
      path: 'stepIds',
      populate: {
        path: 'approverIds'
      }
    }
  }]);

  const statusArr = submission.workflowStatus;

  for (const stepStatus of statusArr) {
    const allUsers = await User.find({ _id: { $in: stepStatus.allUserIds } });
    const activeUsers = await User.find({ _id: { $in: stepStatus.activeUserIds } });
    const approvedUsers = await User.find({ _id: { $in: stepStatus.approvedUserIds } });
    const pendingUsers = await User.find({ _id: { $in: stepStatus.pendingUserIds } });

    stepStatus.allUserIds = allUsers;
    stepStatus.activeUserIds = activeUsers;
    stepStatus.approvedUserIds = approvedUsers;
    stepStatus.pendingUserIds = pendingUsers;
  }

  const approvalLog = await ApprovalLog.find({ workFlowId: submission.workFlowId._id });

  // Convert the submission model instance to a plain JavaScript object
  const submissionObj = submission.toObject();

  // Add the approvalLog array to the plain JavaScript object
  submissionObj.approvalLog = approvalLog;

  return submissionObj;
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
  // return submissionId;
  const submission = await Submission.findById(submissionId);
  if (!submission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Submission not found');
  }

  const approvalStep = await submission.workflowStatus.filter(function (item) { return (item.stepId == updateBody.stepId); })[0];
  if (!approvalStep || approvalStep.status != "inProgress") {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Approval Step!');
  }

  const stepActiveUserId = await approvalStep.activeUserIds.filter(function (item) { return (item == updateBody.userId); })[0];
  if (!stepActiveUserId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid User!');
  }

  if (updateBody.isApproved) {
    approvalStep.approvedUserIds.push(stepActiveUserId);
    approvalStep.activeUser = approvalStep.activeUserIds.filter(function (item) { return (item != updateBody.userId); });

    if (!approvalStep.pendingUserIds.length) {
      approvalStep.status = "approved";
      for (let index = 0; index < submission.workflowStatus.length; index++) {
        const element = submission.workflowStatus[index];
        if (element.status == "pending") {
          element.activeUserIds.push(element.pendingUserIds[0]);
          element.pendingUserIds = element.pendingUserIds.filter(function (item) { return (item != element.pendingUserIds[0]); });
          element.status = "inProgress";
          break;
        }
      }
    }

    if (approvalStep.type == "and") {
      approvalStep.activeUserIds.push(approvalStep.pendingUserIds[0]);
      approvalStep.pendingUserIds = approvalStep.pendingUserIds.filter(function (item) { return (item != approvalStep.pendingUserIds[0]); });
    }

    const checkPendingStep = await submission.workflowStatus.filter(function (item) { return (item.status == "pending"); })[0]
    if (!checkPendingStep) {
      submission.submissionStatus = 3;
    }
  } else {
    submission.isApproved = "pending";
    return submission;
    // res.status(httpStatus.OK).send(approvalStep.pendingUserIds);
  }

  const approvalLog = await approvalLogService.createApprovalLog({
    subModuleId: submission.subModuleId,
    workFlowId: submission.workFlowId,
    stepId: approvalStep._id,
    approvedBy: stepActiveUserId,
    approvedOn: new Date().getTime(),
    remarks: updateBody.remarks,
    isApproved: updateBody.isApproved
  });

  Object.assign(submission, updateBody);
  await submission.save();
  return getSubmissionById(submissionId);
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
