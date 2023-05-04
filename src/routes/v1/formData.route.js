const express = require('express');
const { formDataController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const formDataValidation = require('../../validations/formData.validation');

const router = express.Router();

router
    .route('/')
    .post(auth(), validate(formDataValidation.createFormData), formDataController.createFormData)
    .get(auth(), validate(formDataValidation.getFormsData), formDataController.getFormsData);

router
    .route('/:formDataId')
    .get(auth(), validate(formDataValidation.getFormData), formDataController.getFormData)
    .patch(auth(), validate(formDataValidation.updateFormData), formDataController.updateFormData)
    .delete(auth(), validate(formDataValidation.deleteFormData), formDataController.deleteFormData);

module.exports = router;
