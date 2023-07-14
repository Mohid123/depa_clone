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
    submissionStatus: Joi.number().min(1).max(4),
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
      remarks: Joi.string(),
      isApproved: Joi.required().when('type', {
        is: 'submittal',
        then: Joi.boolean().required(),
        otherwise: Joi.forbidden()
      }),

      //////////Edit Submission
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
      workFlowId: Joi.custom(objectId),
      emailNotifyTo: Joi.array().items(Joi.string().email()),

      ////////////Common
      submissionStatus: Joi.valid(1, 4),
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
  deleteSubmission,
};
