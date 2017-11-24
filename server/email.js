import nodemailer from 'nodemailer'
import Promise from 'bluebird'

require('dotenv').config()

const replaceAll = ({ str, find, replace }) => {
  return str.replace(new RegExp(find, 'ig'), replace)
}

const makeBody = ({ contact, body, headers }) => {
  let personalBody = body
  headers.forEach(head => {
    const identifer = `%${head}%`
    body = replaceAll({ str: personalBody, find: identifer, replace: contact[head] })
  })
  return personalBody
}

const makeOptions = (state) => (
  state.data.map(contact => {
    const body = makeBody({ contact: contact, body: state.html, headers: state.headers })
    return {
      from: `${process.env.ACCOUNT_NAME} <${process.env.ACCOUNT_EMAIL}>`,
      to: contact[state.emailID],
      subject: state.subject,
      html: body
    }
  })
)

const parseData = (state) => {
  return new Promise((resolve) => {
    const csv = makeOptions(state)
    csv.map(mailOption => {
      sendEmail(mailOption, (err) => {
        if (err) {
          console.log(err)
        }
      })
    })
    resolve()
  })
}

const sendEmail = (mailOptions, cb) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
      user: process.env.ACCOUNT_USER,
      pass: process.env.ACCOUNT_PASS
    }
  })

  transporter.verify((error, success) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Server is ready to take our messages')
    }
  })

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      cb(error)
      return
    }
    return console.log('Message sent: %s', info.messageId)
  })
}

export {
  parseData
}
