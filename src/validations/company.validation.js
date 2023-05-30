const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCompany = {
  body: Joi.object().keys({
    groupCode: Joi.string().required(),
    title: Joi.string().required(),
  }),
};

const getCompanies = {
  query: Joi.object().keys({
    groupCode: Joi.string(),
    title: Joi.string(),
    withTrash: Joi.string().allow('', null),
  }),
};

const getCompany = {
  params: Joi.object().keys({
    companyId: Joi.string().custom(objectId),
  }),
};

const updateCompany = {
  params: Joi.object().keys({
    companyId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      groupCode: Joi.string(),
      title: Joi.string(),
      isDeleted: Joi.valid(false),
    })
    .min(1),
};

const deleteCompany = {
  params: Joi.object().keys({
    companyId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
};
