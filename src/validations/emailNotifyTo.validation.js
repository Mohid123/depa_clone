const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createEmailNotifyTo = {
  body: Joi.object().keys({
    moduleId: Joi.required().custom(objectId),
    subModuleId: Joi.custom(objectId),
    submissionId: Joi.custom(objectId),
    emailId: Joi.custom(objectId),
    notifyUsers: Joi.array().items(Joi.string().required().email()).required(),
  }),
};

const getEmailNotifyTos = {
  query: Joi.object().keys({
    name: Joi.string(),
    withTrash: Joi.string().allow('', null),
  }),
};

const getEmailNotifyTo = {
  params: Joi.object().keys({
    emailNotifyToId: Joi.string().custom(objectId),
  }),
};

const updateEmailNotifyTo = {
  params: Joi.object().keys({
    emailNotifyToId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      moduleId: Joi.required().custom(objectId),
      subModuleId: Joi.custom(objectId),
      submissionId: Joi.custom(objectId),
      emailId: Joi.custom(objectId),
      notifyUsers: Joi.array().items(Joi.string().required().email()).required(),
      isDeleted: Joi.valid(false),
    })
    .min(1),
};

const deleteEmailNotifyTo = {
  params: Joi.object().keys({
    emailNotifyToId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createEmailNotifyTo,
  getEmailNotifyTos,
  getEmailNotifyTo,
  updateEmailNotifyTo,
  deleteEmailNotifyTo,
};
