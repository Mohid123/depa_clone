const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createSubModule = {
  body: Joi.object().keys({
    // email: Joi.string().required().email(),
    // password: Joi.string().required().custom(password),
    // name: Joi.string().required(),
    // role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getSubModules = {
  query: Joi.object().keys({
    // name: Joi.string(),
    // role: Joi.string(),
    // sortBy: Joi.string(),
    // limit: Joi.number().integer(),
    // page: Joi.number().integer(),
  }),
};

const getSubModule = {
  params: Joi.object().keys({
    SubModuleId: Joi.string().custom(objectId),
  }),
};

const updateSubModule = {
  params: Joi.object().keys({
    SubModuleId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      // email: Joi.string().email(),
      // password: Joi.string().custom(password),
      // name: Joi.string(),
    })
    .min(1),
};

const deleteSubModule = {
  params: Joi.object().keys({
    SubModuleId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createSubModule,
  getSubModules,
  getSubModule,
  updateSubModule,
  deleteSubModule,
};
