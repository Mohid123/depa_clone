const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const validatedCreateSubModule = {
  query: Joi.object().keys({
    code: Joi.string().required(),
  }),
};

const createSubModule = {
  body: Joi.object().keys({
    categoryId: Joi.string().required().custom(objectId),
    companyId: Joi.string().required().custom(objectId),
    parentId: Joi.string().custom(objectId),
    adminUsers: Joi.array().items(Joi.string().custom(objectId)),
    viewOnlyUsers: Joi.array().items(Joi.string().custom(objectId)),
    formIds: Joi.array().items(Joi.object().required()),
    steps: Joi.array().items(Joi.object({
      "condition": Joi.string().valid("none", "and", "or").required(),
      "approverIds": Joi.array().items(Joi.string().custom(objectId)).required(),
      "emailNotifyTo": Joi.array().items(Joi.string().email()).required(),
    }).required()).required(),
    accessType: Joi.valid("anyCreate", "anyCreateAndModify"),
    summarySchema: Joi.array().items(Joi.object()),
    viewSchema: Joi.array().items(Joi.object()),
    code: Joi.string().required(),
    url: Joi.string().required(),
    title: Joi.string(),
    description: Joi.string(),
    image: Joi.string(),
    status: Joi.valid(1, 2, 3),
  }),
};

const getSubModules = {
  query: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
    companyId: Joi.string().custom(objectId),
    code: Joi.string(),
    withTrash: Joi.string().allow('', null),
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
      categoryId: Joi.string().custom(objectId),
      companyId: Joi.string().custom(objectId),
      parentId: Joi.string().custom(objectId),
      code: Joi.string(),
      url: Joi.string(),
      title: Joi.string(),
      description: Joi.string(),
      image: Joi.string(),
      adminUsers: Joi.array().items(Joi.string().custom(objectId)),
      viewOnlyUsers: Joi.array().items(Joi.string().custom(objectId)),
      summarySchema: Joi.array().items(Joi.object()),
      viewSchema: Joi.array().items(Joi.object()),
      steps: Joi.array().items(Joi.object({
        "id": Joi.string().custom(objectId),
        "condition": Joi.string().valid("none", "and", "or").required(),
        "approverIds": Joi.array().items(Joi.string().custom(objectId)).required(),
        "emailNotifyToId": Joi.string().custom(objectId),
        "emailNotifyTo": Joi.array().items(Joi.string().email()).required(),
      }).required()),
      workFlowId: Joi.custom(objectId).required(),
      accessType: Joi.valid("anyCreate", "anyCreateAndModify"),
      status: Joi.valid(1, 2, 3),
      isDeleted: Joi.valid(false),
    })
    .min(1),
};

const deleteSubModule = {
  params: Joi.object().keys({
    subModuleId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  validatedCreateSubModule,
  createSubModule,
  getSubModules,
  getSubModule,
  getSubModuleBySlug,
  updateSubModule,
  deleteSubModule,
};
