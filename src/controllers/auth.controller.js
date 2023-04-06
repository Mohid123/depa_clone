const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const Session = require('../models/session.model');
const { Token } = require('../models');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { userName } = req.body;
  let user;
  if (userName) {
    user = authService.loginWithWindowsCreds(req, res)
  } else {
    const { email, password } = req.body;
    user = await authService.loginUserWithEmailAndPassword(email, password);
  }

  console.log(user);
  const refreshTokenDoc = await Token.findOne({ userId: user._id});
  if (refreshTokenDoc) {
    await refreshTokenDoc.remove();
  }
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const loginWithWindowsCredentials = catchAsync(async (req, res) => {
  await authService.loginWithWindowsCreds(req, res).then(() => {
    findUserFromActiveDirectory(req, res)
  });
})

const findUserFromActiveDirectory = catchAsync(async (req, res) => {
  await authService.findUserFromAD(req, res);
})

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  loginWithWindowsCredentials,
  findUserFromActiveDirectory
};
