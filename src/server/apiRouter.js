const express = require('express');
const ctrl = require('./controller');
const verifyToken = require('./verifyToken');

const router = express.Router();

//router.route('/send-email').post(verifyToken, ctrl.sendEmail);
router.route('/send-email').post(ctrl.sendEmail);

module.exports = router;
