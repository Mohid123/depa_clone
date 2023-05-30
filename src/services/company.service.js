const httpStatus = require('http-status');
const { Company } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Company
 * @param {Object} companyBody
 * @returns {Promise<Company>}
 */
const createCompany = async (companyBody) => {
  if (await Company.isTitleTaken(companyBody.title)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Title already taken');
  }

  return Company.create(companyBody);
};

/**
 * Query for Companies
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCompanies = async (filter, options) => {
  const Companies = await Company.paginate(filter, options);
  return Companies;
};

/**
 * Get Company by id
 * @param {ObjectId} id
 * @returns {Promise<Company>}
 */
const getCompanyById = async (id) => {
  return Company.findById(id);
};

/**
 * Update Company by id
 * @param {ObjectId} companyId
 * @param {Object} updateBody
 * @returns {Promise<Company>}
 */
const updateCompanyById = async (companyId, updateBody) => {
  const company = await getCompanyById(companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }

  if (await Company.isTitleTaken(updateBody.title, company.id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Title already taken');
  }

  Object.assign(company, updateBody);
  await company.save();
  return company;
};

/**
 * Delete Company by id
 * @param {ObjectId} companyId
 * @returns {Promise<Company>}
 */
const deleteCompanyById = async (companyId) => {
  const Company = await getCompanyById(companyId);
  if (!Company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  await Company.softDelete();
  return Company;
};

module.exports = {
  createCompany,
  queryCompanies,
  getCompanyById,
  updateCompanyById,
  deleteCompanyById,
};
