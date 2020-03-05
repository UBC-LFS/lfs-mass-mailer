const express = require('express');
const ctrl = require('./controller');

const router = express.Router();

router.route('/send-email').post(ctrl.sendEmail);

module.exports = router;
