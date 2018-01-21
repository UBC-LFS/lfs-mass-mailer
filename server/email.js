import nodemailer from 'nodemailer'
import { setTimeout } from 'timers'
import Promise from 'bluebird'
require('dotenv').config()

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
const proprtyCheck = (state) => (
  state.hasOwnProperty('data') && state.hasOwnProperty('emailID') && state.hasOwnProperty('headers') && state.hasOwnProperty('subject') && state.hasOwnProperty('html') &&
  state.data.length > 0 && state.headers.length > 0 && state.emailID !== ''
)

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
const parseData = (state) => {
  return new Promise((resolve, reject) => {
    if (proprtyCheck(state)) {
      const csv = makeOptions(state)
      const sendArray = []
      for (let i = 0; i < csv.length; i++) {
        sendArray.push(timeOut(csv[i], i))
      }
      Promise.all(sendArray)
    .then((msg) => resolve(msg))
    .catch(error => {
      console.log(error)
      reject(error)
    })
    } else {
      reject(new Error('invalid data'))
    }
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
    setTimeout(() => {
      sendEmail(profile)
      .then((msg) => resolve(msg))
      .catch((error) => reject(error))
    }, i * 100)
  })
}

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
const sendEmail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE || false,
      auth: {
        user: process.env.ACCOUNT_USER || 'q237myn5dkklzwpc@ethereal.email',
        pass: process.env.ACCOUNT_PASS || 'cZ67cn7gXezUVPyNwZ'
      },
      tls: {
        rejectUnauthorized: false
      }
    })
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error)
        return
      }
      console.log('Message sent: %s', info.messageId)
      resolve(`Message Sent!`)
    })
  })
}

export {
  parseData,
  replaceAll,
  makeBody,
  makeOptions,
  sendEmail
}
