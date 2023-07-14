const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getSubModulesWithModule = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number(),
    page: Joi.number(),
    withTrash: Joi.string().allow('', null),
  })
};

const getSubModulesByModule = {
  params: Joi.object().keys({
    moduleId: Joi.string().required().custom(objectId),
  }),
  query: Joi.object().keys({
    withTrash: Joi.string().allow('', null),
  })
};

const getSubModulesByModuleSlug = {
  params: Joi.object().keys({
    moduleSlug: Joi.string().required(),
  }),
  query: Joi.object().keys({
    // parentId: Joi.string().custom(objectId),
    field: Joi.valid('companyName', 'subModuleTitle'),
    search: Joi.string(),
    sortBy: Joi.string(),
    sortByTime: Joi.valid('latest', 'oldest'),
    limit: Joi.number(),
    page: Joi.number(),
    withTrash: Joi.string().allow('', null),
  })
};

module.exports = {
  getSubModulesWithModule,
  getSubModulesByModule,
  getSubModulesByModuleSlug
};
