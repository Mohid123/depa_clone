const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { companyService } = require('../../services');

const createCompany = catchAsync(async (req, res) => {
  const Company = await companyService.createCompany(req.body);
  res.status(httpStatus.CREATED).send(Company);
});

const getCompanies = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['companyName', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await companyService.queryCompanies(filter, options);
  res.send(result);
});

const getCompany = catchAsync(async (req, res) => {
  const Company = await companyService.getCompanyById(req.params.CompanyId);
  if (!Company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  res.send(Company);
});

const updateCompany = catchAsync(async (req, res) => {
  const Company = await companyService.updateCompanyById(req.params.companyId, req.body);
  res.send(Company);
});

const deleteCompany = catchAsync(async (req, res) => {
  await companyService.deleteCompanyById(req.params.companyId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
};
