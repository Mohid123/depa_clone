const express = require('express');
const { moduleController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const moduleValidation = require('../../validations/module.validation');
const upload = require('../../middlewares/upload');

const router = express.Router();

router
    .route('/')
    .post(auth(), validate(moduleValidation.createModule), moduleController.createModule)
    .get(auth(), validate(moduleValidation.getModules), moduleController.getModules);

router.post('/upload-image', auth(), upload.single('image'), moduleController.uploadImage);

router
    .route('/slug/:moduleSlug')
    .get(auth(), validate(moduleValidation.getModuleBySlug), moduleController.getModuleBySlug);

router
    .route('/:moduleId')
    .get(auth(), validate(moduleValidation.getModule), moduleController.getModule)
    .patch(auth(), validate(moduleValidation.updateModule), moduleController.updateModule)
    .delete(auth(), validate(moduleValidation.deleteModule), moduleController.deleteModule);

module.exports = router;
