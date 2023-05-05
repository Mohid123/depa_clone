const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createModule = {
  body: Joi.object().keys({
    categoryId: Joi.required().custom(objectId),
    code: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    url: Joi.string().required(),
    image: Joi.string().required(),
    steps: Joi.array().items(Joi.object({
      "condition": Joi.string().valid("none", "and", "or").required(),
      "approverIds": Joi.array().items(Joi.string().custom(objectId)).required(),
    }).required()).required(),
  }),
};

const getModules = {
  query: Joi.object().keys({
    categoryId: Joi.custom(objectId),
    code: Joi.string(),
    title: Joi.string(),
  }),
};

const getModule = {
  params: Joi.object().keys({
    moduleId: Joi.required().custom(objectId),
  }),
};

const updateModule = {
  params: Joi.object().keys({
    moduleId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      categoryId: Joi.custom(objectId),
      code: Joi.string(),
      title: Joi.string(),
      description: Joi.string(),
      url: Joi.string(),
      image: Joi.string(),
      steps: Joi.array().items(Joi.object({
        "id": Joi.string().custom(objectId),
        "condition": Joi.string().valid("none", "and", "or").required(),
        "approverIds": Joi.array().items(Joi.string().custom(objectId)).required(),
      }).required()),
      workFlowId: Joi.custom(objectId),
    })
    .min(1),
};

const deleteModule = {
  params: Joi.object().keys({
    moduleId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createModule,
  getModules,
  getModule,
  updateModule,
  deleteModule,
};