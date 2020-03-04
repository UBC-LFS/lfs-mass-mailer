const MAX_FILE_SIZE = 10000000;
const EMAIL_HEADER = 'Email';
const FIRST_NAME_HEADER = 'First Name';
const LAST_NAME_HEADER = 'Last Name';

const validateEmail = email => {
  const verify = /\S+@\S+\.\S+/;
  return verify.test(email);
}

export {
  MAX_FILE_SIZE,
  EMAIL_HEADER,
  FIRST_NAME_HEADER,
  LAST_NAME_HEADER,
  validateEmail
};
