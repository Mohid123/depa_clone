const express = require('express');
const { moduleController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const router = express.Router();

router.get('/edit/:moduleId', moduleController.edit);
router.put('/update/:moduleId', moduleController.update);

module.exports = router;
