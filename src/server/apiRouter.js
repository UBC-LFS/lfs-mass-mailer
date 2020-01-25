const express = require('express');
const parseData = require('./email');

const router = express.Router();

router.route('/get-username').get((req, res) => {
  return res.status(200).send({ message: "working now" });
});

router.post('/send-email', (req, res) => {
  console.log("body", req.body);
  parseData(req.body)
    .then((success) => res.status(200).send({ msg: 'success', success: success }))
    .catch(error => (res.status(404).send({ msg: 'fail', error: error.message })));
});

module.exports = router;
