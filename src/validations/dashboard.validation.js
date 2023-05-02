const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getModulesByCategory = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number(),
    page: Joi.number(),
  })
};

const getSubModulesByModule = {
  params: Joi.object().keys({
    moduleId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  getModulesByCategory,
  getSubModulesByModule
};
