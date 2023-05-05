const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const categoryRoute = require('./category.route');
const companyRoute = require('./company.route');
const moduleRoute = require('./module.route');
const formRoute = require('./form.route');
const workFlow = require('./workFlow.route');
const subModuleRoute = require('./subModule.route');
const dashboardRoute = require('./dashboard.route');
const formDataRoute = require('./formData.route');
const submissionRoute = require('./submission.route');
const workFlowStep = require('./workFlowStep.route');
const approvalLog = require('./approvalLog.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/companies',
    route: companyRoute,
  },
  {
    path: '/modules',
    route: moduleRoute,
  },
  {
    path: '/forms',
    route: formRoute,
  },
  {
    path: '/workFlows',
    route: workFlow,
  },
  {
    path: '/subModules',
    route: subModuleRoute,
  },
  {
    path: '/',
    route: dashboardRoute,
  },
  {
    path: '/formsData',
    route: formDataRoute,
  },
  {
    path: '/submissions',
    route: submissionRoute,
  },
  {
    path: '/workFlowSteps',
    route: workFlowStep,
  },
  {
    path: '/approvalLogs',
    route: approvalLog,
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
