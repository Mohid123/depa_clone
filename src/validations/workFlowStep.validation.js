const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createWorkFlowStep = {
  body: Joi.object().keys({
    condition: Joi.string().valid("none", "and", "or").required(),
    approverIds: Joi.array().items(Joi.string().custom(objectId)).required(),
    emailNotifyToId: Joi.string().custom(objectId),
  }),
};

const getWorkFlowSteps = {
  query: Joi.object().keys({
    name: Joi.string(),
    withTrash: Joi.string().allow('', null),
  }),
};

const getWorkFlowStep = {
  params: Joi.object().keys({
    workFlowStepId: Joi.string().custom(objectId),
  }),
};

const updateWorkFlowStep = {
  params: Joi.object().keys({
    workFlowStepId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      condition: Joi.string().valid("none", "and", "or"),
      approverIds: Joi.array().items(Joi.string().custom(objectId)),
      emailNotifyToId: Joi.string().custom(objectId),
      isDeleted: Joi.valid(false),
    })
    .min(1),
};

const deleteWorkFlowStep = {
  params: Joi.object().keys({
    workFlowStepId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createWorkFlowStep,
  getWorkFlowSteps,
  getWorkFlowStep,
  updateWorkFlowStep,
  deleteWorkFlowStep,
};
