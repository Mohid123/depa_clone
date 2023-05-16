const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { formService } = require('../../services');

const createForm = catchAsync(async (req, res) => {
  const Form = await formService.createForm(req.body);
  res.status(httpStatus.CREATED).send(Form);
});

const getForms = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['formName', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await formService.queryForms(filter, options);
  res.send(result);
});

const getForm = catchAsync(async (req, res) => {
  const Form = await formService.getFormById(req.params.formId);
  if (!Form) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
  }
  res.send(Form);
});

const updateForm = catchAsync(async (req, res) => {
  const Form = await formService.updateFormById(req.params.formId, req.body);
  res.send(Form);
});

const deleteForm = catchAsync(async (req, res) => {
  await formService.deleteFormById(req.params.formId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createForm,
  getForms,
  getForm,
  updateForm,
  deleteForm,
};
