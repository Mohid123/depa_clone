const express = require('express');
const { emailNotifyToController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const emailNotifyToValidation = require('../../validations/emailNotifyTo.validation');

const router = express.Router();

router
    .route('/')
    .post(auth(), validate(emailNotifyToValidation.createEmailNotifyTo), emailNotifyToController.createEmailNotifyTo)
    .get(auth(), validate(emailNotifyToValidation.getEmailNotifyTos), emailNotifyToController.getEmailNotifyTos);

router
    .route('/:emailNotifyToId')
    .get(auth(), validate(emailNotifyToValidation.getEmailNotifyTo), emailNotifyToController.getEmailNotifyTo)
    .patch(auth(), validate(emailNotifyToValidation.updateEmailNotifyTo), emailNotifyToController.updateEmailNotifyTo)
    .delete(auth(), validate(emailNotifyToValidation.deleteEmailNotifyTo), emailNotifyToController.deleteEmailNotifyTo);

module.exports = router;
