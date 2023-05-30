const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { formDataService } = require('../../services');

const createFormData = catchAsync(async (req, res) => {
  req.body.createdBy = req.user.id;
  const formData = await formDataService.createFormData(req.body);
  res.status(httpStatus.CREATED).send(formData);
});

const getFormsData = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  if (req.query.withTrash !== "") {
    filter.isDeleted = false;
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await formDataService.queryFormsData(filter, options);
  res.send(result);
});

const getFormData = catchAsync(async (req, res) => {
  const formData = await formDataService.getFormDataById(req.params.formDataId);
  if (!formData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'FormData not found');
  }
  res.send(formData);
});

const updateFormData = catchAsync(async (req, res) => {
  req.body.updatedBy = req.user.id;
  const formData = await formDataService.updateFormDataById(req.params.formDataId, req.body);
  res.send(formData);
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
