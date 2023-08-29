const express = require('express');
const { submissionController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const submissionValidation = require('../../validations/submission.validation');

const router = express.Router();

router
    .route('/')
    .post(auth(), validate(submissionValidation.getSubmissions), submissionController.getSubmissions);

router
    .route('/create')
    .post(auth(), validate(submissionValidation.createSubmission), submissionController.createSubmission)

router
    .route('/workflow/:submissionId')
    .patch(auth(), validate(submissionValidation.updateWorkFlowSubmission), submissionController.updateWorkFlowSubmission)

router
    .route('/:submissionId')
    .get(auth(), validate(submissionValidation.getSubmission), submissionController.getSubmission)
    .patch(auth(), validate(submissionValidation.updateSubmission), submissionController.updateSubmission)
    .delete(auth(), validate(submissionValidation.deleteSubmission), submissionController.deleteSubmission);

module.exports = router;
