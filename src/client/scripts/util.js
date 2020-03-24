const MAX_FILE_SIZE = 10000000;

const validateEmail = email => {
  const verify = /\S+@\S+\.\S+/;
  return verify.test(email);
}

export {
  MAX_FILE_SIZE,
  validateEmail
};
