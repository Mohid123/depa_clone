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
      "emailNotifyTo": Joi.array().items(Joi.string().email()).required(),
    }).required()).required(),
  }),
};

const getModules = {
  query: Joi.object().keys({
    categoryId: Joi.custom(objectId),
    code: Joi.string(),
    title: Joi.string(),
    withTrash: Joi.string().allow('', null),
  }),
};

const getModule = {
  params: Joi.object().keys({
    moduleId: Joi.required().custom(objectId),
  }),
};

const getModuleBySlug = {
  params: Joi.object().keys({
    moduleSlug: Joi.string().required(),
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
        "emailNotifyToId": Joi.string().custom(objectId),
        "emailNotifyTo": Joi.array().items(Joi.string().email()).required(),
      }).required()),
      workFlowId: Joi.custom(objectId),
      emailNotifyTo: Joi.array().items(Joi.string().email()),
      isDeleted: Joi.valid(false),
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
  getModuleBySlug,
  updateModule,
  deleteModule,
};
