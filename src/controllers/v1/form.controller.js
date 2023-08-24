const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { formService } = require('../../services');

const validateKeyForm = catchAsync(async (req, res) => {
  const form = await formService.validateKeyForm(req.body);
  res.status(httpStatus.OK).send(form);
});

const createForm = catchAsync(async (req, res) => {
  req.body.createdBy = req.user.id;
  const form = await formService.createForm(req.body);
  res.status(httpStatus.CREATED).send(form);
});

const getForms = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  if (req.query.withTrash !== "") {
    filter.isDeleted = false;
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await formService.queryForms(filter, options);
  res.send(result);
});

const getForm = catchAsync(async (req, res) => {
  const form = await formService.getFormById(req.params.formId);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
  }
  res.send(form);
});

const getFormSlug = catchAsync(async (req, res) => {
  const form = await formService.getFormBySlug(req.params.formKey);
  if (!form) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
  }
  res.send(form);
});

const updateForm = catchAsync(async (req, res) => {
  req.body.updatedBy = req.user.id;
  const form = await formService.updateFormById(req.params.formId, req.body);
  res.send(form);
});

const deleteForm = catchAsync(async (req, res) => {
  await formService.deleteFormById(req.params.formId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  validateKeyForm,
  createForm,
  getForms,
  getForm,
  getFormSlug,
  updateForm,
  deleteForm,
};
