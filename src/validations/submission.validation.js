const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSubmission = {
  body: Joi.object().keys({
    subModuleId: Joi.required().custom(objectId),
    summaryData: Joi.object(),
    formIds: Joi.array().items(Joi.required().custom(objectId)).required(),
    formDataIds: Joi.array().items(Joi.string().custom(objectId)),
    submissionStatus: Joi.number().min(1).max(4),
    workflow: Joi.object().required(),
  }),
};

const getSubmissions = {
  query: Joi.object().keys({
    subModuleId: Joi.string().custom(objectId),
    formIds: Joi.array().items(Joi.string().custom(objectId)),
    formDataIds: Joi.array().items(Joi.string().custom(objectId)),
    submissionStatus: Joi.number().min(1).max(4),
  }),
};

const getSubmission = {
  params: Joi.object().keys({
    SubmissionId: Joi.required().custom(objectId),
  }),
};

const updateSubmission = {
  params: Joi.object().keys({
    SubmissionId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      subModuleId: Joi.string().custom(objectId),
      summaryData: Joi.object(),
      formIds: Joi.array().items(Joi.string().custom(objectId)),
      formDataIds: Joi.array().items(Joi.string().custom(objectId)),
      submissionStatus: Joi.number().min(1).max(4),
      workflow: Joi.object(),
      stepId: Joi.required().custom(objectId),
      userId: Joi.required().custom(objectId),
      remarks: "I think it is good to go",
      isApproved: true
    })
    .min(1),
};

const deleteSubmission = {
  params: Joi.object().keys({
    SubmissionId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmission,
  updateSubmission,
  deleteSubmission,
};
