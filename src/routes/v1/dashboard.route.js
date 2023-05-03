const express = require('express');
const { dashboardController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const dashboardValidation = require('../../validations/dashboard.validation');

const router = express.Router();

router
    .route('/dashboard')
    .get(auth(), validate(dashboardValidation.getModulesByCategory), dashboardController.getModulesByCategory);

router
    .route('/module/:moduleId')
    .get(auth(), validate(dashboardValidation.getSubModulesByModule), dashboardController.getSubModulesByModule);

module.exports = router;
