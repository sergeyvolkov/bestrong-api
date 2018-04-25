'use strict';

module.exports.up = async db => {
  await db.schema.createTable('user', table => {
    table.increments('id').primary();
    table.string('username', 64).unique().notNullable();
    table.string('email', 64).unique().notNullable();
    table.string('salt').notNullable();
    table.timestamps(true, true);
  });

  await db.schema.createTable('credentials', table => {
    table.increments('id').primary();
    table.integer('userId').notNullable();
    table.string('password').notNullable();
    table.timestamps(true, true);

    table.foreign('userId').references('id').inTable('user').onDelete('CASCADE');
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('credentials');
  await db.schema.dropTableIfExists('user');
};
