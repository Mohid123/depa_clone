const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createSubModule = {
  body: Joi.object().keys({
    moduleId: Joi.string().required().custom(objectId),
    companyId: Joi.string().required().custom(objectId),

    code: Joi.string().required(),
    adminUsers: Joi.array().items(Joi.string().custom(objectId)),
    viewOnlyUsers: Joi.array().items(Joi.string().custom(objectId)),
    // defaultWorkFlow: Joi.string().required().custom(objectId),
    formIds: Joi.array().items(Joi.string().custom(objectId)),
    summarySchema: Joi.array().items(Joi.object()),
    viewSchema: Joi.array().items(Joi.object()),
  }),
};

const getSubModules = {
  query: Joi.object().keys({
    moduleId: Joi.string().custom(objectId),
    companyId: Joi.string().custom(objectId),
    code: Joi.string(),
  }),
};

const getSubModule = {
  params: Joi.object().keys({
    subModuleId: Joi.string().custom(objectId),
  }),
};

const updateSubModule = {
  params: Joi.object().keys({
    subModuleId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      moduleId: Joi.string().custom(objectId),
      companyId: Joi.string().custom(objectId),

      code: Joi.string(),
      adminUsers: Joi.array().items(Joi.string().custom(objectId)),
      viewOnlyUsers: Joi.array().items(Joi.string().custom(objectId)),
      defaultWorkFlow: Joi.string().custom(objectId),
      formIds: Joi.array().items(Joi.string().custom(objectId)),
      summarySchema: Joi.array().items(Joi.object()),
      viewSchema: Joi.array().items(Joi.object()),
    })
    .min(1),
};

const deleteSubModule = {
  params: Joi.object().keys({
    subModuleId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createSubModule,
  getSubModules,
  getSubModule,
  updateSubModule,
  deleteSubModule,
};
