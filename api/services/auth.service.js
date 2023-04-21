const jwt = require('jsonwebtoken');

const secret = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'secret';

const authService = () => {
  const issue = (payload) => jwt.sign(payload, secret, { expiresIn: 108000000 });
  const logout = (payload) => jwt.sign(payload, secret, { expiresIn: 0 });
  const verify = (token, cb) => jwt.verify(token, secret, {}, cb);

  return {
    issue,
    verify,
    logout
  };
};

module.exports = authService;