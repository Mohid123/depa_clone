const httpStatus = require('http-status');
const { Submission, WorkflowStep, User, ApprovalLog, FormData, EmailNotifyTo } = require('../models');
const ApiError = require('../utils/ApiError');
const workFlowService = require('./workFlow.service');
const formDataService = require('./formData.service');
const approvalLogService = require('./approvalLog.service');
const emailService = require('./email.service');
const userService = require('./user.service');
const emailNotifyToService = require('./emailNotifyTo.service');

/**
 * Find next workflow step
 * @param {Object} workFlowStatus workFlowStatus
 * @param {Object} workFlowStatusStep workFlowStatus
 */
const getFormDataForEmail = async (formDataIdsArray) => {
  const emailFormData = await FormData.find({ _id: { $in: formDataIdsArray } })
    .select('formId data')
    .populate({
      path: 'formId',
      select: '-_id title',
      options: { lean: true },
      populate: { path: 'data', select: '-submit -_id' }
    });

  const transformedResponse = emailFormData.map((item) => {
    const newData = [];
    for (const key in item.data) {
      if (item.data.hasOwnProperty(key) && key !== 'submit') {
        newData.push({ key, value: item.data[key] });
      }
    }
    return { formId: item.formId, data: newData, id: item.id };
  });

  return transformedResponse;
};

/**
 * Find next workflow step
 * @param {Object} workFlowStatus workFlowStatus
 * @param {Object} workFlowStatusStep workFlowStatus
 */
const emailDataWithTemplate = async (data, isNotify) => {
  const formDataEmail = await getFormDataForEmail(data.formDataIds);
  console.log(data.allUsers);
  // const approvalLogs = await ApprovalLog.find({ submissionId: data.submissionId }).select("approvalStatus remarks").populate('performedById', 'fullName');
  if (!isNotify) {
    for (const user of data.allUsers) {
      let emailUser = user;
      if (!emailUser.email) {
        emailUser = await userService.getUserById(user);
      }

      setTimeout(async () => {
        await emailService.sendEmailWithTemplate(
          emailUser.email,
          "Workflow Active User Notify",
          "src/emails/workflow/active-user.template.hbs",
          {
            submissionId: data.submissionId,
            stepId: data.stepId,
            userId: emailUser.id,
            formData: formDataEmail,
            // approvalLogs: approvalLogs
          }
        );
      }, 500);

    }
  } else {
    data.allUsers.forEach(async user => {
      // if (!user.email) {
      //   user = await userService.getUserById(user);
      // }
      setTimeout(async () => {
        await emailService.sendEmailWithTemplate(
          user,
          "Workflow User Notify",
          "src/emails/workflow/notify-user.template.hbs",
          {
            "formData": formDataEmail,
            // "approvalLogs": approvalLogs
          }
        );
      }, 500);

    });
  }
}
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

  // Replace the email addresses in the data with the created EmailNotifyTo document IDs
  const emailNotifyToIds = [];
  let activeStepNotifyUsers = [];
  let index = 0; index < submissionBody.steps.length; index++
  for (let index = 0; index < submissionBody.steps.length; index++) {
    if (submissionBody.steps[index].emailNotifyTo.length > 0) {
      submissionBody.notifyUsers = submissionBody.steps[index].emailNotifyTo;

      const emailNotifyTo = await emailNotifyToService.createEmailNotifyTo(submissionBody);
      if (!emailNotifyTo) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Email Notify To not found');
      }

      if (!index) {
        activeStepNotifyUsers = submissionBody.steps[index].emailNotifyTo;
      }

      submissionBody.steps[index].emailNotifyToId = emailNotifyTo.id;
      emailNotifyToIds.push(emailNotifyTo.id);
    }
  };

  const workFlow = await workFlowService.createWorkFlow(submissionBody);
  submissionBody.workFlowId = workFlow._id;
  delete submissionBody.steps;

  // Create workflow execution setup
  let activeStepUsers = null;
  const workflowStatusArray = [];
  let activeStepId = null;
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

    if (!index) {
      stepStatusData.status = "inProgress";
      activeStepUsers = step.approverIds;
      activeStepId = element;
    } else {
      stepStatusData.status = "pending";
    }

    workflowStatusArray.push(stepStatusData);
  }
  // Assign workflowStatus to submissionBody
  submissionBody.workflowStatus = workflowStatusArray;

  let workflowUsers = [...new Set(workflowStatusArray.flatMap(step => step.allUsers))];
  workflowUsers = await User.find({ _id: { $in: workflowUsers } }).select('email');
  submissionBody.workflowAllUsers = workflowUsers

  const matchedUsers = [];
  const unmatchedUsers = [];

  workflowUsers.forEach(user => {
    if (activeStepUsers.includes(user.id)) {
      matchedUsers.push(user);
    } else {
      unmatchedUsers.push(user);
    }
  });

  activeStepUsers = matchedUsers;
  const unmatchedEmails = unmatchedUsers.map(user => user.email);
  const allNotifyToUsers = unmatchedEmails.concat(activeStepNotifyUsers);

  // Find inprogress step active users
  const activeStep = workflowStatusArray.find(step => step.status === "inProgress");
  const activeUserIds = activeStep.activeUsers;
  const activeUsersId = await User.find({ _id: { $in: activeUserIds } }).select('id fullName');

  // Add default progress 0 in summary object
  submissionBody.summaryData = {
    progress: 0,
    lastActivityPerformedBy: null,
    pendingOnUsers: activeUsersId
  }
  let submission = await Submission.create(submissionBody);
  submission = await getSubmissionById(submission._id);
  emailNotifyToIds.forEach(emailNotifyToId => {
    emailNotifyToService.updateEmailNotifyToById(emailNotifyToId, {
      "moduleId": submission.subModuleId.moduleId,
      "subModuleId": submission.subModuleId._id,
      "submissionId": submission._id
    })
  });
  // emailDataWithTemplate({
  //   formDataIds: submissionBody.formDataIds,
  //   allUsers: allNotifyToUsers,
  // }, true);
  // emailDataWithTemplate({
  //   formDataIds: submissionBody.formDataIds,
  //   allUsers: activeStepUsers,
  //   submissionId: submission._id,
  //   stepId: activeStepId,
  // }, false);

  return submission;
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
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;

  const submissionFilter = {};
  if (filter.subModuleId) {
    submissionFilter.subModuleId = filter.subModuleId;
  }
  if (filter.submissionStatus) {
    submissionFilter.submissionStatus = filter.submissionStatus;
  }

  submissionFilter.isDeleted = filter.isDeleted;

  const query = Submission.find(submissionFilter).populate(["subModuleId", "formIds", "formDataIds",
    {
      path: "createdBy",
      select: "id fullName"
    },
    {
      path: "workFlowId",
      populate: {
        path: "stepIds",
        populate: [
          {
            path: 'approverIds'
          },
          {
            path: 'emailNotifyToId'
          }
        ]
      }
    }])
    .skip((page - 1) * limit)
    .limit(limit);

  query.sort(options.sortBy == "asc" ? 'createdAt' : '-createdAt');
  const results = await query;

  const totalResults = await Submission.countDocuments(submissionFilter);
  const totalPages = Math.ceil(totalResults / limit);

  return {
    results,
    page: page,
    limit: limit,
    totalPages,
    totalResults,
  };
};

/**
 * Get Submission by id
 * @param {ObjectId} id
 * @returns {Promise<Submission>}
 */
const getSubmissionById = async (id) => {
  const submission = await Submission.findById(id).populate(["subModuleId", "formIds", "formDataIds",
    {
      path: "createdBy",
      select: "id fullName"
    },
    {
      path: "workFlowId",
      populate: {
        path: "stepIds",
        populate: [
          {
            path: 'approverIds'
          },
          {
            path: 'emailNotifyToId'
          }
        ]
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
 * @param {Object} submission submission
 * @param {Object} workFlowStatusStep workFlowStatus
 * @param {Object} approvingUser
 */
const approveStep = async (submission, workFlowStatusStep, approvingUser) => {
  const workFlowStatus = submission.workflowStatus;
  const step = workFlowStatusStep;
  let nextStep = false;

  if (step.condition === "none" || step.condition === "or") {
    // none condition step
    step.status = "approved";
    step.approvedUsers.push(approvingUser);
    nextStep = await nextWorkFlowStep(workFlowStatus, workFlowStatusStep);
    if (nextStep) {
      nextStep.status = "inProgress";
    }
  } else {
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
        nextStep = await nextWorkFlowStep(workFlowStatus, workFlowStatusStep);
        if (nextStep) {
          nextStep.status = "inProgress";
        }
      }
    } else {
      step.approvedUsers.push(approvingUser);
      step.status = "approved";
      nextStep = await nextWorkFlowStep(workFlowStatus, workFlowStatusStep);
      if (nextStep) {
        nextStep.status = "inProgress";
      }
    }
  }

  if (nextStep) {
    emailDataWithTemplate({
      formDataIds: submission.formDataIds,
      allUsers: nextStep.activeUsers,
      submissionId: submission.id,
      stepId: nextStep.stepId,
    }, false);
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
 * @param {Object} submission submission
 * @param {Object} workFlowStatusStep workFlowStatus
 * @param {Object} rejectingUser
 */
const rejectStep = async (submission, workFlowStatusStep, rejectingUser) => {
  const workFlowStatus = submission.workflowStatus;
  const step = workFlowStatusStep;
  let previousStep = false;

  if (step.condition === "none" || step.condition === "or") {
    // none condition step
    previousStep = await previousWorkFlowStep(workFlowStatus, workFlowStatusStep);
    if (previousStep) {
      step.status = "pending";
      previousStep.status = "inProgress";
      const index = previousStep.approvedUsers.pop();
      const user = await userService.getUserById(rejectingUser);
      if (!previousStep.activeUsers.includes(index) && !user.roles.includes('any')) {
        previousStep.activeUsers.push(index);
      }
    }
  } else {
    // and condition step
    if (step.activeUsers.includes(rejectingUser)) {
      // User is part of the current step
      if (step.approvedUsers.length === 0) {
        // No approved user in the step, set as pending
        previousStep = await previousWorkFlowStep(workFlowStatus, workFlowStatusStep)
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
      }
    } else {
      previousStep = await previousWorkFlowStep(workFlowStatus, workFlowStatusStep)
      if (previousStep) {
        step.status = "pending";
        previousStep.status = "inProgress";
        previousStep.approvedUsers.pop();
      }
    }
  }

  if (previousStep) {
    emailDataWithTemplate({
      formDataIds: submission.formDataIds,
      allUsers: previousStep.activeUsers,
      submissionId: submission.id,
      stepId: previousStep.stepId,
    }, false);
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
  const submission = await Submission.findById(submissionId);
  if (!submission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Submission not found');
  }

  if (submission.status == 2) {
    throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Invalid Action');
  }

  if (updateBody.type == "edit" && submission.submissionStatus == 4) {
    if (updateBody.steps) {
      await workFlowService.updateWorkFlowById(submission.workFlowId._id, updateBody);
    }

    if (updateBody.formDataIds) {
      updateBody.formDataIds.forEach(async formData => {
        await formDataService.updateFormDataById(formData._id, formData);
      });
    }

    Object.assign(submission, updateBody);
    await submission.save();

    return getSubmissionById(submissionId);
  }

  const workFlowStatus = submission.workflowStatus;

  const approvalStep = await workFlowStatus.filter(function (item) { return (item.stepId == updateBody.stepId); })[0];

  if (!approvalStep || approvalStep.status != "inProgress") {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Approval Step!');
  }

  const activeUser = await userService.getUserById(updateBody.userId);
  if (!activeUser.roles.includes('any')) {
    const stepActiveUserId = await approvalStep.activeUsers.filter(function (item) { return (item == updateBody.userId); })[0];
    if (!stepActiveUserId) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Invalid User!');
    }
  }

  if (updateBody.submissionStatus || updateBody.status) {
    // Fields to pluck
    const fieldsToPluck = ['submissionStatus', 'status'];

    // Create a new object with the plucked fields
    const newUpdateBody = {};

    fieldsToPluck.forEach(field => {
      if (updateBody.hasOwnProperty(field)) {
        newUpdateBody[field] = updateBody[field];
      }
    });

    if (newUpdateBody.status == 2) {
      newUpdateBody.submissionStatus = 6;
    }

    let action;
    if (updateBody.status) {
      action = 'deleted';
    } else {
      action = updateBody.submissionStatus == 5 ? 'cancelled' : 'enabled';
    }
    await approvalLogService.createApprovalLog({
      subModuleId: submission.subModuleId,
      submissionId: submission.id,
      workFlowId: submission.workFlowId,
      stepId: updateBody.stepId,
      approvedOn: new Date().getTime(),
      remarks: updateBody.remarks,
      action: updateBody.status ? 'deleted' : 'cancelled',
      performedById: updateBody.userId
    });

    Object.assign(submission, newUpdateBody);
    await submission.save();
    return getSubmissionById(submissionId)
  }

  await approvalLogService.createApprovalLog({
    subModuleId: submission.subModuleId,
    submissionId: submission.id,
    workFlowId: submission.workFlowId,
    stepId: approvalStep._id,
    approvedOn: new Date().getTime(),
    remarks: updateBody.remarks,
    approvalStatus: updateBody.isApproved ? 'approved' : 'rejected',
    performedById: updateBody.userId
  });

  if (Boolean(updateBody.isApproved)) {
    const updatedworkFlowStatus = await approveStep(submission, approvalStep, updateBody.userId);

    // Update submission status when all steps are approved
    const allStepsApproved = updatedworkFlowStatus.every(step => step.status === "approved");
    updateBody.submissionStatus = allStepsApproved ? 3 : 2;
  } else {
    await rejectStep(submission, approvalStep, updateBody.userId);
    updateBody.submissionStatus = 2;
  }

  const totalLength = workFlowStatus.length;
  const approvedCount = workFlowStatus.filter(step => step.status === "approved").length;
  const user = await User.findOne({ _id: updateBody.userId });
  submission.summaryData = {
    progress: (approvedCount / totalLength) * 100,
    lastActivityPerformedBy: updateBody.userId,
    userName: user.fullName
  };

  // Object in progress
  const activeStep = submission.workflowStatus.find(step => step.status === "inProgress");
  if (activeStep) {
    const activeUserIds = activeStep.activeUsers;

    const activeUsersId = await User.find({ _id: { $in: activeUserIds } }).select('id fullName');
    submission.summaryData.pendingOnUsers = activeUsersId;
  }

  // let workflowUsers = [...new Set(workFlowStatus.flatMap(step => step.allUsers))];
  // workflowUsers = await User.find({ _id: { $in: workflowUsers } }).select('email');

  // const unmatchedUsers = [];
  // workflowUsers.forEach(user => {
  //   if (!approvalStep.activeUsers.includes(user.id)) {
  //     unmatchedUsers.push(user);
  //   }
  // });
  // const activeStepNotifyUsers = emailNotifyToService.getEmailNotifyToById(approvalStep.emailNotifyToId);
  // const unmatchedEmails = unmatchedUsers.map(user => user.email);
  // let allNotifyToUsers = unmatchedEmails.concat(activeStepNotifyUsers.notifyUsers);
  // allNotifyToUsers = allNotifyToUsers.filter(notify => { notify != stepActiveUserId })

  // emailDataWithTemplate({
  //   formDataIds: submission.formDataIds,
  //   allUsers: allNotifyToUsers,
  // }, true);

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
  await Submission.softDelete();
  return Submission;
};

module.exports = {
  createSubmission,
  querySubmissions,
  getSubmissionById,
  updateSubmissionById,
  deleteSubmissionById,
};
