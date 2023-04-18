const express = require('express');
const { categoryController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const categoryValidation = require('../../validations/category.validation');

const router = express.Router();

router
    .route('/')
    .post(auth(), validate(categoryValidation.createCategory), categoryController.createCategory)
    .get(auth(), validate(categoryValidation.getCategories), categoryController.getCategories);

router
    .route('/:categoryId')
    .get(auth(), validate(categoryValidation.getCategory), categoryController.getCategory)
    .patch(auth(), validate(categoryValidation.updateCategory), categoryController.updateCategory)
    .delete(auth(), validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

module.exports = router;
