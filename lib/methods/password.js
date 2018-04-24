'use strict';

const Crypto = require('crypto');
const Zxcvbn = require('zxcvbn');

module.exports = {
  generateHash: (password, salt) => Crypto.createHmac('sha512', salt).update(password).digest('hex'),
  generateSalt: (length = 64) => Crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length),
  checkStrength: password => Zxcvbn(password),
};
