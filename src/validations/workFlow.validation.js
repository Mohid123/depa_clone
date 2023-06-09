const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createWorkFlow = {
  body: Joi.object().keys({
    steps: Joi.array().items(Joi.object({
      "condition": Joi.string().valid("none", "and", "or").required(),
      "approverIds": Joi.array().items(Joi.string().custom(objectId)).required(),
      "emailNotifyToId": Joi.string().custom(objectId),
    }).required()).required(),
  }),
};

const getWorkFlows = {
  query: Joi.object().keys({
    name: Joi.string(),
    withTrash: Joi.string().allow('', null),
  }),
};

const getWorkFlow = {
  params: Joi.object().keys({
    workFlowId: Joi.string().custom(objectId),
  }),
};

const updateWorkFlow = {
  params: Joi.object().keys({
    workFlowId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      steps: Joi.array().items(Joi.object({
        "id": Joi.string().custom(objectId),
        "condition": Joi.string().valid("none", "and", "or").required(),
        "approverIds": Joi.array().items(Joi.string().custom(objectId)).required(),
        "emailNotifyToId": Joi.string().custom(objectId),
        "emailNotifyTo": Joi.array().items(Joi.string().email()),
      }).required()).required(),
      isDeleted: Joi.valid(false),
    })
    .min(1),
};

const deleteWorkFlow = {
  params: Joi.object().keys({
    workFlowId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createWorkFlow,
  getWorkFlows,
  getWorkFlow,
  updateWorkFlow,
  deleteWorkFlow,
};
