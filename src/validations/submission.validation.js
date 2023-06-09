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
    submissionStatus: Joi.valid(4)
  }),
};

const getSubmissions = {
  query: Joi.object().keys({
    subModuleId: Joi.string().custom(objectId),
    formIds: Joi.array().items(Joi.string().custom(objectId)),
    formDataIds: Joi.array().items(Joi.string().custom(objectId)),
    submissionStatus: Joi.number().min(1).max(4),
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
      summaryData: Joi.object(),
      // formIds: Joi.array().items(Joi.string().custom(objectId)),
      // formDataIds: Joi.array().items(Joi.string().custom(objectId)),
      submissionStatus: Joi.valid(2, 3, 4),
      stepId: Joi.required().custom(objectId),
      userId: Joi.required().custom(objectId),
      remarks: Joi.string(),
      isApproved: Joi.boolean().required(),
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
