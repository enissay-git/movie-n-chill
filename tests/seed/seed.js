const faker = require('faker');
const jwt = require('jsonwebtoken');
const { saveUserForTest, removeAllUser } = require('../../models/user');

const ownerOne = faker.random.number();
const ownerTwo = faker.random.number();
const users = [
  {
    Owner: ownerOne,
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'masnadisawesomefuckyea',
    token: jwt.sign({ Owner: ownerOne }, 'secretkey'),
  },
  {
    Owner: ownerTwo,
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'masnadisawesomefuckyea',
  },
];

const populateUsers = (done) => {
  removeAllUser().then((result) => {
    if (result) {
      const userOne = saveUserForTest(users[0]);
      const userTwo = saveUserForTest(users[1]);
      return Promise.all([userOne, userTwo]);
    }

    return Promise.reject(new Error('no result'));
  }).then(() => done());
};

module.exports = { users, populateUsers };
