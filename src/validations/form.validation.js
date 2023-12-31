const Joi = require('joi');
const { objectId } = require('./custom.validation');

const validateKeyForm = {
  query: Joi.object().keys({
    key: Joi.string().required(),
  }),
};

const createForm = {
  body: Joi.object().keys({
    subModuleId: Joi.string().custom(objectId),
    title: Joi.string().required(),
    display: Joi.string().required(),
    key: Joi.string(),
    components: Joi.array().items(Joi.object().required()),
    permissions: Joi.array().items(Joi.object({
      "options": Joi.array().items(Joi.string().valid("canEdit", "canDelete", "canView", "canSave", "canAdd").required()),
      "user": Joi.required().custom(objectId),
    })),
    // createdBy: Joi.required().custom(objectId),
  }),
};

const getForms = {
  query: Joi.object().keys({
    name: Joi.string(),
    title: Joi.string(),
    key: Joi.string(),
    withTrash: Joi.string().allow('', null),
  }),
};

const getForm = {
  params: Joi.object().keys({
    formId: Joi.string().custom(objectId),
  }),
};


const getFormSlug = {
  params: Joi.object().keys({
    formKey: Joi.string().required(),
  }),
};

const updateForm = {
  params: Joi.object().keys({
    formId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      display: Joi.string(),
      key: Joi.string(),
      components: Joi.array().items(Joi.object()),
      permissions: Joi.array().items(Joi.object({
        "options": Joi.string().valid("canEdit", "canDelete", "canView", "canSave", "canAdd").required(),
        "user": Joi.required().custom(objectId),
      })),
      isDeleted: Joi.valid(false),
    })
    .min(1),
};

const deleteForm = {
  params: Joi.object().keys({
    formId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  validateKeyForm,
  createForm,
  getForms,
  getForm,
  getFormSlug,
  updateForm,
  deleteForm,
};
