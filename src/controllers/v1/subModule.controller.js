const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { subModuleService } = require('../../services');

const createSubModule = catchAsync(async (req, res) => {
  const SubModule = await subModuleService.createSubModule(req.body);
  res.status(httpStatus.CREATED).send(SubModule);
});

const getSubModules = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['subModulename', 'role']);
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

const updateSubModule = catchAsync(async (req, res) => {
  const subModule = await subModuleService.updateSubModuleById(req.params.subModuleId, req.body);
  res.send(subModule);
});

const deleteSubModule = catchAsync(async (req, res) => {
  await subModuleService.deleteSubModuleById(req.params.subModuleId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSubModule,
  getSubModules,
  getSubModule,
  updateSubModule,
  deleteSubModule,
};
