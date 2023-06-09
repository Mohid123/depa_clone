const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { emailNotifyToService } = require('../../services');

const createEmailNotifyTo = catchAsync(async (req, res) => {
  req.body.createdBy = req.user.id;
  const emailNotifyTo = await emailNotifyToService.createEmailNotifyTo(req.body);
  res.status(httpStatus.CREATED).send(emailNotifyTo);
});

const getEmailNotifyTos = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  if (req.query.withTrash !== "") {
    filter.isDeleted = false;
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await emailNotifyToService.queryEmailNotifyTos(filter, options);
  res.send(result);
});

const getEmailNotifyTo = catchAsync(async (req, res) => {
  const emailNotifyTo = await emailNotifyToService.getEmailNotifyToById(req.params.emailNotifyToId);
  if (!emailNotifyTo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'emailNotifyTo not found');
  }
  res.send(emailNotifyTo);
});

const updateEmailNotifyTo = catchAsync(async (req, res) => {
  req.body.updatedBy = req.user.id;
  const emailNotifyTo = await emailNotifyToService.updateEmailNotifyToById(req.params.emailNotifyToId, req.body);
  res.send(emailNotifyTo);
});

const deleteEmailNotifyTo = catchAsync(async (req, res) => {
  await emailNotifyToService.deleteEmailNotifyToById(req.params.emailNotifyToId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createEmailNotifyTo,
  getEmailNotifyTos,
  getEmailNotifyTo,
  updateEmailNotifyTo,
  deleteEmailNotifyTo,
};
