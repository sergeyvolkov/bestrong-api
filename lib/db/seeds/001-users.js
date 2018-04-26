'use strict';

const user1 = {
  user: {
    id: 1001,
    username: 'login1',
    email: 'login1@email.com',
    salt: '66d9d20b14814f433845034ff2a816fdb558582229e86f63a590ce8a8ab77441',
  },
  credentials: {
    userId: 1001,
    // password -> 'f00b@red!!'
    password: 'f45037f713a969d9214fd46a8d1fce09e5bdbc01626ec40f52d440a7da5483f9a9849ad519bb161ee915919811cdd1e813972cd82ce64c6fc3e9328c3b8d88a0',
  },
};

const user2 = {
  user: {
    id: 1002,
    username: 'login2',
    email: 'login2@email.com',
    salt: 'fc52a95f43b2fa91f2a9236043a4f5ae8eaee3dec94b8391647ad42d3951c597',
  },
  credentials: {
    userId: 1002,
    // password -> 'f00b@red!!!'
    password: 'd210f3689e620a69c6e81ae58181ca5c4aae9793c3e8fe331cca62dfb6aa354eb8a06c2fec0bb2d1e30df5cab4a47c704cdb0d42051b3b256c482e64085df6de',
  },
};

module.exports.seed = async knex => {
  await knex('user').insert([
    user1.user,
    user2.user,
  ]);

  await knex('credentials').insert([
    user1.credentials,
    user2.credentials,
  ]);
};
