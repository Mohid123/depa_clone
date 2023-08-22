const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSubmission = {
  body: Joi.object().keys({
    subModuleId: Joi.required().custom(objectId),
    formIds: Joi.array().items(Joi.required().custom(objectId)).required(),
    formDataIds: Joi.array().items(Joi.object({
      "formId": Joi.required().custom(objectId),
      "data": Joi.object().required(),
    }).required()).required(),
    steps: Joi.array().items(Joi.object({
      "condition": Joi.string().valid("none", "and", "or").required(),
      "approverIds": Joi.array().items(Joi.string().custom(objectId)).required(),
      "emailNotifyTo": Joi.array().items(Joi.string().email()).required(),
    }).required()).required(),
    submissionStatus: Joi.valid(1, 4),
  }),
};

const getSubmissions = {
  query: Joi.object().keys({
    subModuleId: Joi.string().custom(objectId),
    formIds: Joi.array().items(Joi.string().custom(objectId)),
    formDataIds: Joi.array().items(Joi.string().custom(objectId)),
    submissionStatus: Joi.number().min(1).max(6),
    sortBy: Joi.string(),
    limit: Joi.number(),
    page: Joi.number(),
    withTrash: Joi.string().allow('', null),
  }),
};

const getSubmission = {
  params: Joi.object().keys({
    submissionId: Joi.required().custom(objectId),
  }),
};

const updateSubmission = {
  params: Joi.object().keys({
    submissionId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      ///////////Submittal
      // summaryData: Joi.object(),
      // formIds: Joi.array().items(Joi.string().custom(objectId)),
      // formDataIds: Joi.array().items(Joi.string().custom(objectId)),
      // submissionStatus: Joi.valid(2, 3, 4),
      type: Joi.string().optional(),
      stepId: Joi.required().when('type', {
        is: 'submittal',
        then: Joi.required().custom(objectId),
        otherwise: Joi.forbidden()
      }),
      userId: Joi.required().when('type', {
        is: 'submittal',
        then: Joi.required().custom(objectId),
        otherwise: Joi.forbidden()
      }),
      onBehalfOf: Joi.when('type', {
        is: 'submittal',
        then: Joi.custom(objectId),
        otherwise: Joi.forbidden()
      }),
      isApproved: Joi.when('type', {
        is: 'submittal',
        then: Joi.boolean(),
        otherwise: Joi.forbidden()
      }),
      remarks: Joi.when('type', {
        is: 'submittal',
        then: Joi.string(),
        otherwise: Joi.forbidden()
      }),
      submissionStatus: Joi.when('type', {
        is: 'submittal',
        then: Joi.valid(2, 5),
        otherwise: Joi.optional()
      }),
      status: Joi.when('type', {
        is: 'submittal',
        then: Joi.valid(2),
        otherwise: Joi.forbidden()
      }),

      //////////Edit Submission
      formDataIds: Joi.required().when('type', {
        is: 'edit',
        then: Joi.array().items(Joi.object({
          "_id": Joi.string().custom(objectId),
          "data": Joi.object(),
        }).required()),
        otherwise: Joi.forbidden()
      }),
      steps: Joi.required().when('type', {
        is: 'edit',
        then: Joi.array().items(Joi.object({
          "id": Joi.string().custom(objectId),
          "condition": Joi.string().valid("none", "and", "or").required(),
          "approverIds": Joi.array().items(Joi.string().custom(objectId)).required(),
          "emailNotifyToId": Joi.string().custom(objectId),
          "emailNotifyTo": Joi.array().items(Joi.string().email()).required(),
        }).required()),
        otherwise: Joi.forbidden()
      }),
      workFlowId: Joi.when('type', {
        is: 'edit',
        then: Joi.custom(objectId).required(),
        otherwise: Joi.forbidden()
      }),
      emailNotifyTo: Joi.when('type', {
        is: 'edit',
        then: Joi.array().items(Joi.string().email()),
        otherwise: Joi.forbidden()
      }),
      submissionStatus: Joi.when('type', {
        is: 'edit',
        then: Joi.valid(1, 4),
        otherwise: Joi.optional()
      }),

      ////////////Common
      isDeleted: Joi.valid(false),
    })
    .min(1),
};

const updateWorkFlowSubmission = {
  params: Joi.object().keys({
    submissionId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      action: Joi.valid('add', 'edit', 'delete').required(),
      stepStatus: Joi.object({
        allUsers: Joi.array().items({
          _id: Joi.custom(objectId),
          assignedTo: Joi.required().custom(objectId),
        }),
        activeUsers: Joi.array().items(Joi.string().custom(objectId)),
        // approvedUsers: Joi.array().items(Joi.string().custom(objectId)).required(),
        condition: Joi.string().valid("none", "and", "or"),
        status: Joi.valid('inProgress', 'pending'),
        stepId: Joi.custom(objectId),
        _id: Joi.custom(objectId),
        approverIds: Joi.array().items(Joi.string().custom(objectId)),
      }).required(),
      ////////////Common
      isDeleted: Joi.valid(false),
    })
    .min(1),
};

const deleteSubmission = {
  params: Joi.object().keys({
    submissionId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmission,
  updateSubmission,
  updateWorkFlowSubmission,
  deleteSubmission,
};
