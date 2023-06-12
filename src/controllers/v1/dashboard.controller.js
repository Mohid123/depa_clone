const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { dashboardService } = require('../../services');
const { Module } = require('../../models');

const getModulesByCategory = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  if (req.query.withTrash !== "") {
    filter.isDeleted = false;
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await dashboardService.queryModulesByCategory(filter, options);
  res.send(result);
});

const getSubModulesByModule = catchAsync(async (req, res) => {
  const module = await dashboardService.querySubModulesByModule(req.params.moduleId);
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }
  res.send(module);
});

const getSubModulesByModuleSlug = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['moduleSlug']);
  if (req.query.withTrash !== "") {
    filter.isDeleted = false;
  }
  filter.code = req.params.moduleSlug;

  const options = pick(req.query, ['field', 'search', 'sortBy', 'sortByTime', 'limit', 'page']);

  const module = await dashboardService.querySubModulesByModuleSlug(filter, options);
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }

  res.send(module);
});


module.exports = {
  getModulesByCategory,
  getSubModulesByModule,
  getSubModulesByModuleSlug
};
