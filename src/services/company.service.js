const httpStatus = require('http-status');
const { Company } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Company
 * @param {Object} CompanyBody
 * @returns {Promise<Company>}
 */
const createCompany = async (CompanyBody) => {
  if (await Company.isTitleTaken(CompanyBody.title)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Title already taken');
  }

  return Company.create(CompanyBody);
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
 * Get Company by email
 * @param {string} email
 * @returns {Promise<Company>}
 */
const getCompanyByEmail = async (email) => {
  return Company.findOne({ email });
};

/**
 * Update Company by id
 * @param {ObjectId} CompanyId
 * @param {Object} updateBody
 * @returns {Promise<Company>}
 */
const updateCompanyById = async (CompanyId, updateBody) => {
  const Company = await getCompanyById(CompanyId);
  if (!Company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  Object.assign(Company, updateBody);
  await Company.save();
  return Company;
};

/**
 * Delete Company by id
 * @param {ObjectId} CompanyId
 * @returns {Promise<Company>}
 */
const deleteCompanyById = async (CompanyId) => {
  const Company = await getCompanyById(CompanyId);
  if (!Company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  await Company.remove();
  return Company;
};

module.exports = {
  createCompany,
  queryCompanies,
  getCompanyById,
  getCompanyByEmail,
  updateCompanyById,
  deleteCompanyById,
};
