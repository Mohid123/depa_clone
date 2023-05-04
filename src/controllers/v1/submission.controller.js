const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { submissionService } = require('../../services');

const createSubmission = catchAsync(async (req, res) => {
  const Submission = await submissionService.createSubmission(req.body);
  res.status(httpStatus.CREATED).send(Submission);
});

const getSubmissions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['submissionName', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await submissionService.querySubmissions(filter, options);
  res.send(result);
});

const getSubmission = catchAsync(async (req, res) => {
  const Submission = await submissionService.getSubmissionById(req.params.submissionId);
  if (!Submission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Submission not found');
  }
  res.send(Submission);
});

const updateSubmission = catchAsync(async (req, res) => {
  const Submission = await submissionService.updateSubmissionById(req.params.submissionId, req.body);
  res.send(Submission);
});

const deleteSubmission = catchAsync(async (req, res) => {
  await submissionService.deleteSubmissionById(req.params.submissionId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmission,
  updateSubmission,
  deleteSubmission,
};
