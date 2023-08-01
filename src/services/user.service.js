const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  // if (userBody.roles.includes('user') && userBody.roles.includes('admin')) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, "User role can't be added with admin");
  // }


  if (!userBody.password) {
    // userBody.password = "p@$$w0rd";
    userBody.password = "12345678";
  }

  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  // Adjust the filter to include regex search on fullName if provided
  if (filter.fullName) {
    filter.fullName = { $regex: filter.fullName, $options: 'i' };
  }

  // Add logic for latest and oldest records
  if (filter.latest) {
    filter.createdAt = { $lte: new Date() };
  }
  if (filter.oldest) {
    filter.createdAt = { $gte: new Date() };
  }

  // options.sort = { createdAt: -1 };
  const users = await User.paginate(filter, options);

  return users;
};

/**
 * Query for admin users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAdminUsers = async (filter, options) => {
  // Adjust the filter to include regex search on fullName if provided
  if (filter.fullName) {
    filter.fullName = { $regex: filter.fullName, $options: 'i' };
  }

  // Add logic for latest and oldest records
  if (filter.latest) {
    filter.createdAt = { $lte: new Date() };
  }
  if (filter.oldest) {
    filter.createdAt = { $gte: new Date() };
  }

  filter.roles = ['admin'];
  const users = await User.paginate(filter, options);

  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  // if (userBody.roles.includes('user') && userBody.roles.includes('admin')) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, "User role can't be added with admin");
  // }
  // if (updateBody.roles.includes('any') && !updateBody.roles.includes('admin')) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Any role must come with Admin');
  // }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.softDelete();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  queryAdminUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
