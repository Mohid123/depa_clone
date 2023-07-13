const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createFormData = {
  body: Joi.object().keys({
    formId: Joi.required().custom(objectId),
    data: Joi.object().required(),
    createdBy: Joi.required().custom(objectId),
  }),
};

const getFormsData = {
  query: Joi.object().keys({
    formId: Joi.custom(objectId),
    withTrash: Joi.string().allow('', null),
  }),
};

const getFormData = {
  params: Joi.object().keys({
    formDataId: Joi.string().custom(objectId),
  }),
};

const updateFormData = {
  params: Joi.object().keys({
    formDataId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      formId: Joi.custom(objectId),
      data: Joi.object(),
      isDeleted: Joi.valid(false),
    })
    .min(1),
};

const deleteFormData = {
  params: Joi.object().keys({
    formDataId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createFormData,
  getFormsData,
  getFormData,
  updateFormData,
  deleteFormData,
};
