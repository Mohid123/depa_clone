const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getModulesByCategory = {
  query: Joi.object().keys({
    withTrash: Joi.string().allow('', null),
    sortBy: Joi.string(),
    limit: Joi.number(),
    page: Joi.number(),
  })
};

const getSubModulesByModule = {
  params: Joi.object().keys({
    moduleId: Joi.string().required().custom(objectId),
    withTrash: Joi.string().allow('', null),
  }),
};

const getSubModulesByModuleSlug = {
  params: Joi.object().keys({
    moduleSlug: Joi.string().required(),
    withTrash: Joi.string().allow('', null),
  }),
};

module.exports = {
  getModulesByCategory,
  getSubModulesByModule,
  getSubModulesByModuleSlug
};
