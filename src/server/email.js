const nodemailer = require('nodemailer');
const Promise = require('bluebird');

require('dotenv').config()

/**
 * Conditional function to safeguard for invalid data formats
 *
 * @param {object} state
 *   state = { data: [ { 'First Name': 'Bob', 'Email': 'bob@alumni.ubc.ca' } ],
      emailID: 'Email',
      headers: [ 'First Name', 'Email' ],
      subject: 'test',
      html: '<p>Hello %First Name%</p>' }
 * @return {boolean}
 */
const propertyCheck = state => (
  state.hasOwnProperty('data') && state.hasOwnProperty('emailID') && state.hasOwnProperty('headers') && state.hasOwnProperty('subject') && state.hasOwnProperty('html') &&
  state.data.length > 0 && state.headers.length > 0 && state.emailID !== ''
)

const replaceAll = ({ str, find, replace }) => {
  return str.replace(new RegExp(find, 'ig'), replace)
}

/**
 * Constructs a unique HTML body by replacing identifiers with elements in a CSV row.
 *
 * @param {object} { contact, body, headers }
 *   contact = { firstname: 'Bob', lastname: 'lee', email: 'bob.lee@alumni.ubc.ca' }
 *   body = '<p>Hello %firstname%</p>'
 *   headers = [ 'firstname', 'lastname', 'email' ]
 * @return {string} HTML string
 */
const makeBody = ({ contact, body, headers }) => {
  let uniqueBody = body
  headers.forEach(head => {
    const identifer = `%${head}%`
    uniqueBody = replaceAll({ str: uniqueBody, find: identifer, replace: contact[head] })
  })
  return uniqueBody
}

/**
 * Constructs a unique nodemailer friendly email format for every row in the CSV.
 *
 * @param {object} state
 *   state = { data: [ { 'First Name': 'Bob', 'Email': 'bob@alumni.ubc.ca' } ],
      emailID: 'Email',
      headers: [ 'First Name', 'Email' ],
      subject: 'test',
      html: '<p>Hello %First Name%</p>' }
 * @return {array} Array of Objects formatted for nodemailer
 */
const makeOptions = (state) => (
  state.data.map(contact => (
    {
      from: `${process.env.ACCOUNT_NAME} <${process.env.ACCOUNT_EMAIL}>`,
      to: contact[state.emailID],
      subject: state.subject,
      html: makeBody({ contact: contact, body: state.html, headers: state.headers })
    }
  ))
)

/**
 * Sends an email using .env specified credentials
 *
 * @param {object} mailOptions
 * { from: 'Patrick Lin <patrick.lin@sauder.ubc.ca>',
        to: 'bob@alumni.ubc.ca',
        subject: 'testsuite',
        html: '<p>Hello Patrick</p>' }
 * @return {promise}
 */
const sendEmail = mailOptions => {
  console.log("sendEmail");
  return new Promise((resolve, reject) => {
    console.log("sendEmail Promise");
    const transporter = nodemailer.createTransport({
      pool: true,
      host: process.env.EMAIL_HOST,
      port: '',
      secure: false,
      requireTLS: true,
      auth: {
        user: '',
        pass: ''
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    // console.log(transporter);

    /*transporter.verify((error, success) => {
      console.log("here");
      if (error) {
        console.log("transporter", error);
      } else {
        console.log("Server is ready!");
      }
    });*/

    console.log("now sending");
    console.log(mailOptions);
    transporter.sendMail(mailOptions, (error, info) => {
      console.log("here");
      if (error) {
        reject(error);
        return;
      }
      console.log('Message sent: %s', info.messageId);
      resolve(`Message Sent!`);
    });
  })
}

/**
 * Sends the unique email at a specified time
 *
 * @param {object} profile
 * { from: 'Patrick Lin <patrick.lin@sauder.ubc.ca>',
        to: 'bob@alumni.ubc.ca',
        subject: 'testsuite',
        html: '<p>Hello Patrick</p>' }
 * @param {number} i
 * @return {promise}
 */
const timeOut = (profile, i) => {
  return new Promise((resolve, reject) => {
    console.log("timeout", i);
    setTimeout(() => {
      console.log("sendingemail", i);
      sendEmail(profile)
      .then((msg) => resolve(msg))
      .catch((error) => reject(error))
    }, 1000);
  })
}



/**
 * Management function that adds a small delay on every every email and resolves after emails are sent
 *
 * @param {object} state
 *   state = { data: [ { 'First Name': 'Bob', 'Email': 'bob@alumni.ubc.ca' } ],
      emailID: 'Email',
      headers: [ 'First Name', 'Email' ],
      subject: 'test',
      html: '<p>Hello %First Name%</p>' }
 * @return {promise}
 */
const parseData = state => {
  return new Promise((resolve, reject) => {
    console.log("propertyCheck", propertyCheck(state));

    if ( propertyCheck(state) ) {
      const csv = makeOptions(state);
      // console.log("csv", csv);

      const sendArray = [];
      for (let i = 0; i < csv.length; i++) {
        console.log("index", i);
        sendArray.push(timeOut(csv[i], i));
      }
      // console.log("sendArray", sendArray);

      /*Promise.all(sendArray)
        .then((msg) => resolve(msg))
        .catch(error => {
          console.log(error);
          reject(error);
        })*/
    } else {
      reject(new Error('invalid data'));
    }
  })
}


module.exports = parseData;
