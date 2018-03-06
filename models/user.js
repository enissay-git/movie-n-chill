const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userTools = this;

userTools.getAllUser = () => new Promise((resolve, reject) => {
  db.query('SELECT * from user', (error, results, fields) => {
    if (error) {
      reject();
    } else {
      resolve({ results: results[0], fields });
    }
  });
});

userTools.saveUser = userinfo => new Promise((resolve, reject) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(userinfo.password, salt);
  const userInfoHash = {
    password: hash,
    token: jwt.sign({ Owner: userinfo.Owner }, 'secretkey'),
  };

  db.query('INSERT INTO user SET ?', userInfoHash, (error, results, fields) => {
    if (error) {
      reject(error);
    } else {
      resolve({ userinfo, fields });
    }
  });
});

userTools.getUserByToken = token => new Promise((resolve, reject) => {
  try {
    const decoded = jwt.verify(token, 'secretkey');
    resolve(decoded);
  } catch (e) {
    reject(e);
  }
});

/* Functions only used for testing data */

userTools.saveUserForTest = user => new Promise((resolve, reject) => {
  db.query('INSERT INTO user SET ?', user, (error, results, fields) => {
    if (error) {
      reject(error);
    } else {
      resolve({ results, fields });
    }
  });
});

userTools.removeAllUser = () => new Promise((resolve, reject) => {
  db.query('DELETE from user where ID > 0', (error, results, fields) => {
    if (error) {
      reject(error);
    } else {
      resolve({ results, fields });
    }
  });
});


// The code below export the above functios so it can be used in other files.
module.exports = {
  saveUser: userTools.saveUser,
  getUserByToken: userTools.getUserByToken,
  saveUserForTest: userTools.saveUserForTest,
  removeAllUser: userTools.removeAllUser,
};
