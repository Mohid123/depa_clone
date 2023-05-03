const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { dashboardService } = require('../../services');

const getModulesByCategory = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['categoryName']);
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


module.exports = {
  getModulesByCategory,
  getSubModulesByModule,
};
