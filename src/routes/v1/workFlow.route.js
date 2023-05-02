const express = require('express');
const { workFlowController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const workFlowValidation = require('../../validations/workFlow.validation');

const router = express.Router();

router
    .route('/')
    .post(auth(), validate(workFlowValidation.createWorkFlow), workFlowController.createWorkFlow)
    .get(auth(), validate(workFlowValidation.getWorkFlows), workFlowController.getWorkFlows);

router
    .route('/:workFlowId')
    .get(auth(), validate(workFlowValidation.getWorkFlow), workFlowController.getWorkFlow)
    .patch(auth(), validate(workFlowValidation.updateWorkFlow), workFlowController.updateWorkFlow)
    .delete(auth(), validate(workFlowValidation.deleteWorkFlow), workFlowController.deleteWorkFlow);

module.exports = router;
