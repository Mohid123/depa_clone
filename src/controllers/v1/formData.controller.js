const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { formDataService } = require('../../services');

const createFormData = catchAsync(async (req, res) => {
  const FormData = await formDataService.createFormData(req.body);
  res.status(httpStatus.CREATED).send(FormData);
});

const getFormsData = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['formDataName', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await formDataService.queryFormsData(filter, options);
  res.send(result);
});

const getFormData = catchAsync(async (req, res) => {
  const FormData = await formDataService.getFormDataById(req.params.formDataId);
  if (!FormData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'FormData not found');
  }
  res.send(FormData);
});

const updateFormData = catchAsync(async (req, res) => {
  const FormData = await formDataService.updateFormDataById(req.params.formDataId, req.body);
  res.send(FormData);
});

const deleteFormData = catchAsync(async (req, res) => {
  await formDataService.deleteFormDataById(req.params.formDataId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createFormData,
  getFormsData,
  getFormData,
  updateFormData,
  deleteFormData,
};
