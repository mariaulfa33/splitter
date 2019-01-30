'use strict'
const bcrypt = require('bcrypt');

function getPass(password) {
  const saltRounds = 10;
  return new Promise((resolve, reject) => {
   bcrypt.hash(password, saltRounds)
   .then(hash => {
     resolve(hash)
   })
   .catch(err => {
     reject(err)
   })
  })
}

module.exports = getPass