const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSubmission = {
  body: Joi.object().keys({
    subModuleId: Joi.required().custom(objectId),
    summaryData: Joi.object(),
    formIds: Joi.array().items(Joi.required().custom(objectId)).required(),
    formDataIds: Joi.array().items(Joi.string().custom(objectId)),
    submissionStatus: Joi.number().min(1).max(4),
    steps: Joi.array().items(Joi.object().required()),
  }),
};

const getSubmissions = {
  query: Joi.object().keys({
    subModuleId: Joi.string().custom(objectId),
    formIds: Joi.array().items(Joi.string().custom(objectId)),
    formDataIds: Joi.array().items(Joi.string().custom(objectId)),
    submissionStatus: Joi.number().min(1).max(4),
    subModuleId: Joi.string().custom(objectId),
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
      formIds: Joi.array().items(Joi.string().custom(objectId)),
      formDataIds: Joi.array().items(Joi.string().custom(objectId)),
      submissionStatus: Joi.number().min(1).max(4),
      stepId: Joi.required().custom(objectId),
      userId: Joi.required().custom(objectId),
      remarks: Joi.string().required(),
      isApproved: Joi.boolean().required()
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
