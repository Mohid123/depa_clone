const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createCategory = {
  body: Joi.object().keys({
    // email: Joi.string().required().email(),
    // password: Joi.string().required().custom(password),
    // name: Joi.string().required(),
    // role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getCategories = {
  query: Joi.object().keys({
    // name: Joi.string(),
    // role: Joi.string(),
    // sortBy: Joi.string(),
    // limit: Joi.number().integer(),
    // page: Joi.number().integer(),
  }),
};

const getCategory = {
  params: Joi.object().keys({
    // CategoryId: Joi.string().custom(objectId),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    CategoryId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      // email: Joi.string().email(),
      // password: Joi.string().custom(password),
      // name: Joi.string(),
    })
    .min(1),
};

const deleteCategory = {
  params: Joi.object().keys({
    CategoryId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
