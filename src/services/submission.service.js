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

  // Create workflow execution setup
  const workflowStatusArray = [];
  for (let index = 0; index < workFlow.stepIds.length; index++) {
    const element = workFlow.stepIds[index];
    let step = await WorkflowStep.findById(element);
    let aproverIdsArray = step.approverIds;
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

  // Add default progress 0 in summary object
  submissionBody.summaryData = {
    progress: 0,
  }

  // Assign workflowStatus to submissionBody
  submissionBody.workflowStatus = workflowStatusArray;

  const submission = await Submission.create(submissionBody);
  return getSubmissionById(submission._id);
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
  const submission = await Submission.findById(id).populate(["subModuleId", "formIds", "formDataIds", {
    path: "workFlowId",
    populate: {
      path: "stepIds",
      populate: {
        path: "approverIds"
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

  const workFlowStatus = submission.workflowStatus;

  const approvalStep = await workFlowStatus.filter(function (item) { return (item.stepId == updateBody.stepId); })[0];
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
      for (let index = 0; index < workFlowStatus.length; index++) {
        const element = workFlowStatus[index];
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
    } else {
      approvalStep.status = "approved";
    }

    const checkPendingStep = await workFlowStatus.filter(function (item) { return (item.status == "pending"); })[0]
    if (!checkPendingStep) {
      submission.submissionStatus = 3;
    }
  } else {
    // Get the first object in the array that has approvedUserIds
    const approvedObject = workFlowStatus.find((obj) => obj.approvedUserIds.length > 0);

    if (approvedObject) {
      // Move activeUserIds to pendingUserIds
      const activeUserIds = workFlowStatus[0].activeUserIds;
      workFlowStatus[0].pendingUserIds.push(...activeUserIds);
      workFlowStatus[0].activeUserIds = [];

      // Pop the last approvedUserId and set it to activeUserIds
      const lastApprovedUserId = approvedObject.approvedUserIds.pop();
      workFlowStatus[0].activeUserIds.push(lastApprovedUserId);

      // If approvedUserIds is now empty, remove the object
      if (approvedObject.approvedUserIds.length === 0) {
        const index = workFlowStatus.indexOf(approvedObject);
        workFlowStatus.splice(index, 1);
      }
    } else {
      // Move activeUserIds to pendingUserIds
      const activeUserIds = workFlowStatus[0].activeUserIds;
      workFlowStatus[0].pendingUserIds.push(...activeUserIds);
      workFlowStatus[0].activeUserIds = [];

      // If previous object exists, change its status to in progress
      if (workFlowStatus.length > 1) {
        workFlowStatus[workFlowStatus.length - 2].status = 'inProgress';
      }

      // Change current object status to pending
      workFlowStatus[0].status = 'pending';
    }
  }
  // res.status(httpStatus.OK).send(approvalStep.pendingUserIds);

  const totalLength = workFlowStatus.length;
  const approvedCount = workFlowStatus.filter(step => step.status === "approved").length;
  submission.summaryData = {
    progress: (approvedCount / totalLength) * 100
  };

  await approvalLogService.createApprovalLog({
    subModuleId: submission.subModuleId,
    workFlowId: submission.workFlowId,
    stepId: approvalStep._id,
    approvedOn: new Date().getTime(),
    remarks: updateBody.remarks,
    approvalStatus: updateBody.isApproved ? 'approved' : 'rejected',
    performedById: stepActiveUserId,
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
