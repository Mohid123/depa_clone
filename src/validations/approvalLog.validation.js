const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createApprovalLog = {
  body: Joi.object().keys({
    companyId: Joi.string().custom(objectId),
    moduleId: Joi.string().custom(objectId),
    subModuleId: Joi.required().custom(objectId),
    workFlowId: Joi.required().custom(objectId),
    stepId: Joi.required().custom(objectId),
    performedById: Joi.required().custom(objectId),
    approvedOn: Joi.date().required(),
    remarks: Joi.string().required(),
    approvalStatus: Joi.string().valid('inProgress', 'pending', 'approved', 'rejected').required(),
  }),
};

const getApprovalLogs = {
  query: Joi.object().keys({
    name: Joi.string(),
    withTrash: Joi.string().allow('', null),
  }),
};

const getApprovalLog = {
  params: Joi.object().keys({
    approvalLogId: Joi.string().custom(objectId),
  }),
};

const updateApprovalLog = {
  params: Joi.object().keys({
    approvalLogId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      isDeleted: Joi.valid(false),
    })
    .min(1),
};

const deleteApprovalLog = {
  params: Joi.object().keys({
    approvalLogId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createApprovalLog,
  getApprovalLogs,
  getApprovalLog,
  updateApprovalLog,
  deleteApprovalLog,
};
