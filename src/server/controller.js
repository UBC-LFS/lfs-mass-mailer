const nodemailer = require('nodemailer');
const async = require('async');

require('dotenv').config();

const validateData = state => {
  return state.hasOwnProperty('data') && state.hasOwnProperty('subject') && state.hasOwnProperty('html') && state.hasOwnProperty('text') && state.data.length > 0
};

const replaceFirstName = (message, firstName) => {
  if (message !== null) {
    return message.replace(new RegExp('%FIRST_NAME%', 'ig'), firstName);
  }
};

async function send(transporter, body) {
  let receivers = [];

  try {
    for (let user of body.data) {
      let sent = await transporter.sendMail({
        from: `${process.env.ACCOUNT_NAME} <${process.env.ACCOUNT_EMAIL}>`,
        to: user['Email'],
        subject: body.subject,
        html: replaceFirstName(body.html, user['First Name']),
        text: replaceFirstName(body.text, user['First Name'])
      });
      receivers.push(user['First Name'] + " " + user['Last Name'] + " <" + user['Email'] + ">");
    }

  } catch (error) {
    throw new Error('An error occurred while sending an email.');
  } finally {
    return receivers;
  }
}

exports.sendEmail = (req, res, next) => {
  if ( validateData(req.body) ) {
    
    // setup
    // https://community.nodemailer.com/2-0-0-beta/setup-smtp/
    // Options for port and secure
    // In most cases set this value to true if you are connecting to port 465. For port 587 or 25 keep it false

    var smtp = {
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.ACCOUNT_USER,
        pass: process.env.ACCOUNT_PASS
      }
    };

    var smtpRelay = {
      host: process.env.EMAIL_HOST,
      port: 25,
      secure: false,
      tls: {
        rejectUnauthorized: false
      },
      auth: {
        user: process.env.ACCOUNT_USER,
        pass: process.env.ACCOUNT_PASS
      }
    };

    let transporter = nodemailer.createTransport(smtpRelay);

    let verify = new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        console.error('verify error:', error);
        if (error) reject('An error occurred. Authentication unsuccessful. Please check your information.');
        else resolve(success);
      });
    });

    verify.then(success => {
      send(transporter, req.body).catch(e => {
        console.error(e);
      }).then(receivers => {
        if (req.body.data.length === receivers.length) {
          res.status(200).send({ message: 'Success', receivers: receivers });
        } else {
          res.status(400).send({ message: 'Error', receivers: receivers });
        }
      });

    }).catch(error => {
      res.status(400).send({ message: error });
    });

  } else {
    res.status(400).send({ message: 'An error occurred. Form is invalid' });
  }
};
