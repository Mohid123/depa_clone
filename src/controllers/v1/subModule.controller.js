const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { subModuleService } = require('../../services');

const validateCreateSubModule = catchAsync(async (req, res) => {
  const isCodeTaken = await subModuleService.validateCreateSubModule(req.body);
  res.status(httpStatus.CREATED).send(isCodeTaken);
});

const createSubModule = catchAsync(async (req, res) => {
  req.body.createdBy = req.user.id;
  const subModule = await subModuleService.createSubModule(req.body);
  res.status(httpStatus.CREATED).send(subModule);
});

const getSubModules = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  if (req.query.withTrash !== "") {
    filter.isDeleted = false;
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await subModuleService.querySubModules(filter, options);
  res.send(result);
});

const getSubModule = catchAsync(async (req, res) => {
  const subModule = await subModuleService.getSubModuleById(req.params.subModuleId);
  if (!subModule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubModule not found');
  }
  res.send(subModule);
});

const getSubModuleBySlug = catchAsync(async (req, res) => {
  const subModule = (await subModuleService.getSubModuleBySlug(req.params.subModuleSlug));
  if (!subModule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubModule not found');
  }
  res.send(subModule);
});


const updateSubModule = catchAsync(async (req, res) => {
  req.body.updatedBy = req.user.id;
  const subModule = await subModuleService.updateSubModuleById(req.params.subModuleId, req.body);
  res.send(subModule);
});

const deleteSubModule = catchAsync(async (req, res) => {
  await subModuleService.deleteSubModuleById(req.params.subModuleId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  validateCreateSubModule,
  createSubModule,
  getSubModules,
  getSubModule,
  getSubModuleBySlug,
  updateSubModule,
  deleteSubModule,
};
