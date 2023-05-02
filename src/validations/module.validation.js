const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createModule = {
  body: Joi.object().keys({
    categoryId: Joi.required().custom(objectId),
    defaultWorkFlow: Joi.required().custom(objectId),
    code: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    url: Joi.string().required(),
    image: Joi.string().required(),
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
