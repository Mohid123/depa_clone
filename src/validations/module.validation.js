const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createModule = {
  body: Joi.object().keys({
    // email: Joi.string().required().email(),
    // password: Joi.string().required().custom(password),
    // name: Joi.string().required(),
    // role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getModules = {
  query: Joi.object().keys({
    // name: Joi.string(),
    // role: Joi.string(),
    // sortBy: Joi.string(),
    // limit: Joi.number().integer(),
    // page: Joi.number().integer(),
  }),
};

const getModule = {
  params: Joi.object().keys({
    ModuleId: Joi.string().custom(objectId),
  }),
};

const updateModule = {
  params: Joi.object().keys({
    ModuleId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      // email: Joi.string().email(),
      // password: Joi.string().custom(password),
      // name: Joi.string(),
    })
    .min(1),
};

const deleteModule = {
  params: Joi.object().keys({
    ModuleId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createModule,
  getModules,
  getModule,
  updateModule,
  deleteModule,
};
