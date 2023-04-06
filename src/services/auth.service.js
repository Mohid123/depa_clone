const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const ActiveDirectory = require('activedirectory2');
const { User } = require('../models');

const config = {
  url: 'ldap://192.168.0.98',
  baseDN: 'dc=qt,dc=com',
  username: 'mohid@qt.com',
  password: 'Abc1234'
}
const ad = new ActiveDirectory(config);

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Login with Windows Credentials
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{username, password, message}>}
 */
const loginWithWindowsCreds = async (req, res) => {
  const { userName, password } = req.body;
  const username = userName;
  return ad.authenticate(username, password, async (err, auth) => {
    if (err) {
      throw new ApiError(httpStatus.BAD_REQUEST, JSON.stringify(err));
    }
    if (auth) {
      return findOrCreateAdUser(req, res)
    }
    else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Authentication Failed');
    }
  });
}

const findOrCreateAdUser = async (req, res) => {
  const { userName, password } = req.body;
  const username = userName;
  ad.findUser(username, async (err, user) => {
    if (err) {
      throw new ApiError(httpStatus.BAD_REQUEST, err);
    }
    debugger
    const userData = new User({
      userName: user.sAMAccountName,
      fullName: user.sAMAccountName,
      email: user.mail,
      password: password
    });
    debugger
    let User = await userService.getUserByEmail(userData.email);
    debugger
    if(!User) {
      User = userData.save((err) => {
        if (err) {
          throw new ApiError(httpStatus.BAD_REQUEST, err);
        }
      });
    }
    debugger
    return User;
  });
}


/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  loginWithWindowsCreds,
  findOrCreateAdUser
};
