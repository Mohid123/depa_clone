const express = require('express');
const { formController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const formValidation = require('../../validations/form.validation');

const router = express.Router();

router
    .route('/')
    .post(auth(), validate(formValidation.createForm), formController.createForm)
    .get(auth(), validate(formValidation.getForms), formController.getForms);

router
    .route('/:formId')
    .get(auth(), validate(formValidation.getForm), formController.getForm)
    .patch(auth(), validate(formValidation.updateForm), formController.updateForm)
    .delete(auth(), validate(formValidation.deleteForm), formController.deleteForm);

module.exports = router;
