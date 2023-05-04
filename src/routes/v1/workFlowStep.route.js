const express = require('express');
const { workFlowStepController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const workFlowStepValidation = require('../../validations/workFlowStep.validation');

const router = express.Router();

router
    .route('/')
    .post(auth(), validate(workFlowStepValidation.createWorkFlowStep), workFlowStepController.createWorkFlowStep)
    .get(auth(), validate(workFlowStepValidation.getWorkFlowSteps), workFlowStepController.getWorkFlowSteps);

router
    .route('/:workFlowStepId')
    .get(auth(), validate(workFlowStepValidation.getWorkFlowStep), workFlowStepController.getWorkFlowStep)
    .patch(auth(), validate(workFlowStepValidation.updateWorkFlowStep), workFlowStepController.updateWorkFlowStep)
    .delete(auth(), validate(workFlowStepValidation.deleteWorkFlowStep), workFlowStepController.deleteWorkFlowStep);

module.exports = router;
