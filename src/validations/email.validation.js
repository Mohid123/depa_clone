const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createEmail = {
  body: Joi.object().keys({
    to: Joi.string().required().email(),
    submissionId: Joi.required().custom(objectId),
    stepId: Joi.required().custom(objectId),
    userId: Joi.required().custom(objectId),
  }),
};

const getEmails = {
  query: Joi.object().keys({
    to: Joi.string().email(),
    submissionId: Joi.custom(objectId),
    stepId: Joi.custom(objectId),
    userId: Joi.custom(objectId),
    withTrash: Joi.string().allow('', null),
  })
};

module.exports = {
  createEmail,
  getEmails
};
