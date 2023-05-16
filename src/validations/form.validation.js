const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createForm = {
  body: Joi.object().keys({
    subModuleId: Joi.string().custom(objectId),
    title: Joi.string().required(),
    display: Joi.string().required(),
    key: Joi.string(),
    components: Joi.array().items(Joi.object().required()),
  }),
};

const getForms = {
  query: Joi.object().keys({
    name: Joi.string(),
    title: Joi.string(),
    key: Joi.string(),
  }),
};

const getForm = {
  params: Joi.object().keys({
    formId: Joi.string().custom(objectId),
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
    })
    .min(1),
};

const deleteForm = {
  params: Joi.object().keys({
    formId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createForm,
  getForms,
  getForm,
  updateForm,
  deleteForm,
};
