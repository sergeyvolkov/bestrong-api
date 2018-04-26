'use strict';

const component1 = {
  title: 'proteins',
};
const component2 = {
  title: 'fats',
};
const component3 = {
  title: 'carbohydrates',
};

const usersId = [1001, 1002];

module.exports.seed = async knex => {
  await knex('default_food_component').insert([
    component1,
    component2,
    component3,
  ]);

  // add default food components for all users
  for (let userId of usersId) {
    await knex('food_component').insert([
      {
        ...component1,
        userId,
      },
      {
        ...component2,
        userId,
      },
      {
        ...component3,
        userId,
      },
    ]);
  }
};
