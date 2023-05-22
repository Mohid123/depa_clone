const httpStatus = require('http-status');
const { Submission, WorkflowStep, User, ApprovalLog } = require('../models');
const ApiError = require('../utils/ApiError');
const workFlowService = require('./workFlow.service');
const formDataService = require('./formData.service');
const approvalLogService = require('./approvalLog.service');

/**
 * Create a Submission
 * @param {Object} submissionBody
 * @returns {Promise<Submission>}
 */
const createSubmission = async (submissionBody) => {
  const { formDataIds } = submissionBody;

  const formsData = await formDataService.createManyFormsData(formDataIds);
  if (!formsData) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Forms Data is Invalid');
  }
  submissionBody.formDataIds = formsData.map(({ _id }) => _id);

  const workFlow = await workFlowService.createWorkFlow(submissionBody);
  submissionBody.workFlowId = workFlow._id;
  delete submissionBody.steps;

  // Create workflow execution setup
  const workflowStatusArray = [];
  for (let index = 0; index < workFlow.stepIds.length; index++) {
    const element = workFlow.stepIds[index];
    let step = await WorkflowStep.findById(element);
    let stepStatusData = {
      stepId: element,
      allUsers: step.approverIds,
      activeUsers: step.approverIds,
      approvedUserIds: [],
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
    const allUsers = await User.find({ _id: { $in: stepStatus.allUsers } });
    const activeUsers = await User.find({ _id: { $in: stepStatus.activeUsers } });
    const approvedUsers = await User.find({ _id: { $in: stepStatus.approvedUsers } });

    stepStatus.allUsers = allUsers;
    stepStatus.activeUsers = activeUsers;
    stepStatus.approvedUsers = approvedUsers;
  }

  const approvalLog = await ApprovalLog.find({ workFlowId: submission.workFlowId._id }).populate("performedById");

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
 * Find next workflow step
 * @param {Object} workFlowStatus workFlowStatus
 * @param {Object} workFlowStatusStep workFlowStatus
 */
const nextWorkFlowStep = async (workFlowStatus, workFlowStatusStep) => {
  const currentIndex = workFlowStatus.findIndex(obj => obj.stepId == workFlowStatusStep.stepId);

  let nextObject = false;
  if (currentIndex !== -1 && currentIndex < workFlowStatus.length - 1) {
    nextObject = workFlowStatus[currentIndex + 1];
  }

  return nextObject;
};

/**
 * Function to perform approval action
 * @param {Object} workFlowStatus workFlowStatus
 * @param {Object} workFlowStatusStep workFlowStatus
 * @param {Object} approvingUser
 */
const approveStep = async (workFlowStatus, workFlowStatusStep, approvingUser) => {
  const step = workFlowStatusStep;

  if (step.condition === "none" || step.condition === "or") {
    // none condition step
    step.status = "approved";
    step.approvedUsers.push(approvingUser);
    const nextStep = await nextWorkFlowStep(workFlowStatus, workFlowStatusStep);
    if (nextStep) {
      nextStep.status = "inProgress";
    }
  }
  // else if (step.condition === "or") {
  //   // or condition step
  //   if (step.approvedUsers.length === 0) {
  //     // First approval in the step
  //     step.approvedUsers.push(approvingUser);
  //     step.status = "approved";
  //     const nextStep = await nextWorkFlowStep(workFlowStatus, workFlowStatusStep);
  //     if (nextStep) {
  //       nextStep.status = "inProgress";
  //     }
  //   }
  // }
  else if (step.condition === "and") {
    // and condition step
    if (step.activeUsers.includes(approvingUser)) {
      // User is part of the current step
      if (step.activeUsers.some(user => step.activeUsers.includes(user) && user !== approvingUser)) {
        // At least one pending approval in the step
        step.approvedUsers.push(approvingUser);
        step.activeUsers.splice(step.activeUsers.indexOf(approvingUser), 1);
        // step.status = "approved";
      } else {
        // Last user performing approval in the step
        step.approvedUsers.push(approvingUser);
        step.status = "approved";
        const nextStep = await nextWorkFlowStep(workFlowStatus, workFlowStatusStep);
        if (nextStep) {
          nextStep.status = "inProgress";
        }
      }
    }
  }

  return workFlowStatus;
}

/**
 * Find previous workflow step
 * @param {Object} workFlowStatus workFlowStatus
 * @param {Object} workFlowStatusStep workFlowStatus
 */
const previousWorkFlowStep = async (workFlowStatus, workFlowStatusStep) => {
  const currentIndex = workFlowStatus.findIndex(obj => obj.stepId === workFlowStatusStep.stepId);

  let previousObject = false;

  if (currentIndex !== -1 && currentIndex > 0) {
    previousObject = workFlowStatus[currentIndex - 1];
  }

  return previousObject
};

/**
 * Function to perform rejection action
 * @param {Object} workFlowStatus workFlowStatus
 * @param {Object} workFlowStatusStep workFlowStatus
 * @param {Object} rejectingUser
 */
const rejectStep = async (workFlowStatus, workFlowStatusStep, rejectingUser) => {
  const step = workFlowStatusStep;

  if (step.condition === "none" || step.condition === "or") {
    // none condition step
    const previousStep = await previousWorkFlowStep(workFlowStatus, workFlowStatusStep);
    if (previousStep) {
      step.status = "pending";
      previousStep.status = "inProgress";
      const index = previousStep.approvedUsers.pop();
      if (!previousStep.activeUsers.includes(index)) {
        previousStep.activeUsers.push(index);
      }
    }
  }
  // else if (step.condition === "or") {
  //   // or condition step
  //   if (step.approvedUsers.length === 0) {
  //     // First rejection in the step
  //     step.status = "pending";
  //     const previousStep = await previousWorkFlowStep(workFlowStatus, workFlowStatusStep)
  //     if (previousStep) {
  //       previousStep.status = "inProgress";
  //     }
  //   } else {
  //     // Rollback to the same hierarchy
  //     const index = step.approvedUsers.indexOf(rejectingUser);
  //     if (index !== -1) {
  //       step.approvedUsers.splice(index);
  //       step.status = "pending";
  //       const previousStep = await previousWorkFlowStep(workFlowStatus, workFlowStatusStep)
  //       if (previousStep) {
  //         previousStep.status = "inProgress";
  //         previousStep.approvedUsers.push(rejectingUser);
  //       }
  //     }
  //   }
  // }
  else if (step.condition === "and") {
    // and condition step
    if (step.activeUsers.includes(rejectingUser)) {
      // User is part of the current step
      if (step.approvedUsers.length === 0) {
        // No approved user in the step, set as pending
        const previousStep = await previousWorkFlowStep(workFlowStatus, workFlowStatusStep)
        if (previousStep) {
          step.status = "pending";
          previousStep.status = "inProgress";
          const index = previousStep.approvedUsers.pop();
          if (!previousStep.activeUsers.includes(index)) {
            previousStep.activeUsers.push(index);
          }
        }
      } else {
        // Rollback to the same hierarchy or previous step
        const index = step.approvedUsers.pop();
        step.activeUsers.push(index);
        // if (index !== -1) {
        //   step.approvedUsers.splice(index);
        //   if (step.approvedUsers.length === 0) {
        //     // Rollback to the previous step
        //     const previousStep = await previousWorkFlowStep(workFlowStatus, workFlowStatusStep)
        //     if (previousStep) {
        //       step.status = "pending";
        //       previousStep.status = "inProgress";
        //       previousStep.approvedUsers.push(rejectingUser);
        //     }
        //   } else {
        //     // Rollback to the same step
        //     step.status = "approved";
        //     const nextStep = workflow.find(step => step.stepId > stepId);
        //     if (nextStep) {
        //       nextStep.status = "inProgress";
        //     }
        //   }
        // }
      }
    }
  }

  return workFlowStatus;
}

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

  const stepActiveUserId = await approvalStep.activeUsers.filter(function (item) { return (item == updateBody.userId); })[0];
  if (!stepActiveUserId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid User!');
  }

  if (updateBody.isApproved) {
    const updatedworkFlowStatus = await approveStep(workFlowStatus, approvalStep, stepActiveUserId);

    // Update submission status when all steps are approved
    const allStepsApproved = updatedworkFlowStatus.every(step => step.status === "approved");
    updateBody.submissionStatus = allStepsApproved ? 3 : 2;
  } else {
    await rejectStep(workFlowStatus, approvalStep, stepActiveUserId);
    updateBody.submissionStatus = 2;
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
