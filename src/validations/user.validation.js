const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().custom(password),
    fullName: Joi.string().required(),
    roles: Joi.array().items(Joi.string().required().valid('admin', 'any', 'user')),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    fullName: Joi.string(),
    roles: Joi.array().items(Joi.string().valid('admin', 'any', 'user')),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    latest: Joi.valid("true"),
    oldest: Joi.valid("true"),
    withTrash: Joi.string().allow('', null),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      fullName: Joi.string(),
      roles: Joi.array().items(Joi.string().required().valid('admin', 'any', 'user')),
      isDeleted: Joi.valid(false),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
