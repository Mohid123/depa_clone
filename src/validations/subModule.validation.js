const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createSubModule = {
  body: Joi.object().keys({
    moduleId: Joi.string().required().custom(objectId),
    companyId: Joi.string().required().custom(objectId),
    adminUsers: Joi.array().items(Joi.string().custom(objectId)),
    viewOnlyUsers: Joi.array().items(Joi.string().custom(objectId)),
    formIds: Joi.array().items(Joi.object().required()),
    steps: Joi.array().items(Joi.object().required()),

    summarySchema: Joi.array().items(Joi.object()),
    viewSchema: Joi.array().items(Joi.object()),
    code: Joi.string().required(),
    url: Joi.string().required(),
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

const getSubModuleBySlug = {
  params: Joi.object().keys({
    subModuleSlug: Joi.string().required(),
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
      url: Joi.string(),
      adminUsers: Joi.array().items(Joi.string().custom(objectId)),
      viewOnlyUsers: Joi.array().items(Joi.string().custom(objectId)),
      summarySchema: Joi.array().items(Joi.object()),
      viewSchema: Joi.array().items(Joi.object()),
      formIds: Joi.array().items(Joi.object().required()),
      steps: Joi.array().items(Joi.object({
        "id": Joi.string().custom(objectId),
        "condition": Joi.string().valid("none", "and", "or").required(),
        "approverIds": Joi.array().items(Joi.string().custom(objectId)).required(),
      }).required()),
      workFlowId: Joi.custom(objectId),
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
  getSubModuleBySlug,
  updateSubModule,
  deleteSubModule,
};
