const express = require('express');
const { dashboardController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const dashboardValidation = require('../../validations/dashboard.validation');
const upload = require('../../middlewares/upload');

const router = express.Router();

router
    .route('/dashboard')
    .get(auth(), validate(dashboardValidation.getSubModulesWithModule), dashboardController.getSubModulesWithModule);

router.post('/upload', upload.single('file'), dashboardController.uploadFile);

router
    .route('/module/slug/:moduleSlug')
    .get(auth(), validate(dashboardValidation.getSubModulesByModuleSlug), dashboardController.getSubModulesByModuleSlug);

router
    .route('/module/:moduleId')
    .get(auth(), validate(dashboardValidation.getSubModulesByModule), dashboardController.getSubModulesByModule);


module.exports = router;
