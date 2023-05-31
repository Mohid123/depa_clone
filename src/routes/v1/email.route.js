const express = require('express');
const { emailController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const emailValidation = require('../../validations/email.validation');

const router = express.Router();

router
    .route('/')
    .post(auth(), validate(emailValidation.createEmail), emailController.createEmail)
    .get(auth(), validate(emailValidation.getEmails), emailController.getEmails);

module.exports = router;
