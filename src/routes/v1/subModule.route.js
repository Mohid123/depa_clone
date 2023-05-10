const express = require('express');
const { subModuleController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const subModuleValidation = require('../../validations/subModule.validation');

const router = express.Router();

router
    .route('/')
    .post(auth(), validate(subModuleValidation.createSubModule), subModuleController.createSubModule)
    .get(auth(), validate(subModuleValidation.getSubModules), subModuleController.getSubModules);

router
    .route('/slug/:subModuleSlug')
    .get(auth(), validate(subModuleValidation.getSubModuleBySlug), subModuleController.getSubModuleBySlug);

router
    .route('/:subModuleId')
    .get(auth(), validate(subModuleValidation.getSubModule), subModuleController.getSubModule)
    .patch(auth(), validate(subModuleValidation.updateSubModule), subModuleController.updateSubModule)
    .delete(auth(), validate(subModuleValidation.deleteSubModule), subModuleController.deleteSubModule);

module.exports = router;
