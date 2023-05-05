const express = require('express');
const { approvalLogController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const approvalLogValidation = require('../../validations/approvalLog.validation');

const router = express.Router();

router
    .route('/')
    .post(auth(), validate(approvalLogValidation.createApprovalLog), approvalLogController.createApprovalLog)
    .get(auth(), validate(approvalLogValidation.getApprovalLogs), approvalLogController.getApprovalLogs);

router
    .route('/:approvalLogId')
    .get(auth(), validate(approvalLogValidation.getApprovalLog), approvalLogController.getApprovalLog)
    .patch(auth(), validate(approvalLogValidation.updateApprovalLog), approvalLogController.updateApprovalLog)
    .delete(auth(), validate(approvalLogValidation.deleteApprovalLog), approvalLogController.deleteApprovalLog);

module.exports = router;
