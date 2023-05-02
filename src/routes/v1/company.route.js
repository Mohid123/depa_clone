const express = require('express');
const { companyController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const companyValidation = require('../../validations/company.validation');

const router = express.Router();

router
    .route('/')
    .post(auth(), validate(companyValidation.createCompany), companyController.createCompany)
    .get(auth(), validate(companyValidation.getCompanies), companyController.getCompanies);

router
    .route('/:companyId')
    .get(auth(), validate(companyValidation.getCompany), companyController.getCompany)
    .patch(auth(), validate(companyValidation.updateCompany), companyController.updateCompany)
    .delete(auth(), validate(companyValidation.deleteCompany), companyController.deleteCompany);

module.exports = router;
