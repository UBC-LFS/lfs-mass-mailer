const nodemailer = require('nodemailer');
const async = require('async');

require('dotenv').config();

const validateData = state => {
  return state.hasOwnProperty('data') && state.hasOwnProperty('subject') && state.hasOwnProperty('html') && state.hasOwnProperty('text') && state.data.length > 0
};

exports.sendEmail = (req, res, next) => {
  if ( validateData(req.body) ) {

    // options for ort and secure
    // In most cases set this value to true if you are connecting to port 465. For port 587 or 25 keep it false
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.ACCOUNT_USER,
        pass: process.env.ACCOUNT_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    let receivers = [];
    async.each(req.body.data, function(user, callback) {

      const mailOptions = {
        from: `${process.env.ACCOUNT_NAME} <${process.env.ACCOUNT_EMAIL}>`,
        //to: user['Email'],
        subject: req.body.subject,
        html: req.body.html,
        text: req.body.text
      };

      transporter.verify(function(error, success) {
        if (error) {
          res.status(400).send({ message: 'An error occurred while verifying a SMTP transport. Please check the information of a sender.' });
        } else {
          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              callback('An error occurred while sending an email. Please check receivers.');
            } else {
              receivers.push(user['First Name'] + " " + user['Last Name'] + " <" + user['Email'] + ">");
              callback();
            }
          });
        }
      });

    }, function(err) {
      if (err) {
        console.log(err);
        res.status(400).send({ message: err, receivers: receivers });
      } else {
        res.status(200).send({ message: 'Success', receivers: receivers });
      }
    });

  } else {
    res.status(400).send({ message: 'An error occurred. Form is invalid' });
  }
};
