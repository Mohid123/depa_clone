const express = require('express');
const { moduleController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const router = express.Router();

router.get('/edit/:moduleId',auth(), moduleController.edit);
router.put('/update/:moduleId',auth(), moduleController.update);

module.exports = router;
