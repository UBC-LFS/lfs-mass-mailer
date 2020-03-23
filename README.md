# Mass Mailer

[![Build Status](https://travis-ci.org/UBC-LFS/lfs-mass-mailer.svg?branch=master)](https://travis-ci.org/UBC-LFS/lfs-mass-mailer)
[![Known Vulnerabilities](https://snyk.io/test/github/UBC-LFS/lfs-mass-mailer/badge.svg)](https://snyk.io/test/github/UBC-LFS/lfs-mass-mailer)
[![dependencies Status](https://david-dm.org/UBC-LFS/lfs-mass-mailer/status.svg)](https://david-dm.org/UBC-LFS/lfs-mass-mailer)

[![codecov](https://codecov.io/gh/UBC-LFS/lfs-mass-mailer/branch/master/graph/badge.svg)](https://codecov.io/gh/UBC-LFS/lfs-mass-mailer)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](http://facebook.github.io/jest/)
[![Cypress.io tests](https://img.shields.io/badge/cypress.io-tests-green.svg?style=flat-square)](https://cypress.io)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)



### Boilerplate: https://github.com/crsandeep/simple-react-full-stack


### Core NPM Package
- Nodemailer: [SMTP Transporter](https://nodemailer.com/smtp/)


### Setup SMTP server
- [UBC Mail Server Settings](https://it.ubc.ca/services/email-voice-internet/ubc-faculty-staff-email-fasmail/fasmail-setup-documents#serversettings)


### Create environment variables
Create **.env** file and specify the following:

```
# For UBC
EMAIL_HOST=smtp.mail-relay.ubc.ca or smtp.mail.ubc.ca

EMAIL_HOST=
ACCOUNT_USER=
ACCOUNT_PASS=
ACCOUNT_EMAIL=
ACCOUNT_NAME=
```


## SMTP setting options
- Go go lfs-mass-mailer/srv/server/controller.js
- Then change the variable name in **createTransport**


1. smtp.mail-relay.ubc.ca (by default)
```
let transporter = nodemailer.createTransport(smtpRelay);

```


2. smtp.mail.ubc.ca
```
let transporter = nodemailer.createTransport(smtp);

```



### Quick Start

```
# Clone the repository
git clone https://github.com/crsandeep/simple-react-full-stack

# Go inside the directory
cd simple-react-full-stack

# Install dependencies
yarn (or npm install)

# Start development server
yarn dev (or npm run dev)

# Build for production
yarn build (or npm run build)

# Start production server
yarn start (or npm start)
```
