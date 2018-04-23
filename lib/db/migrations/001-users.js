'use strict';

exports.up = async (db) => {
  await db.schema.createTable('user', (table) => {
    table.increments('id').primary();
    table.string('username', 64).notNullable();
    table.string('email', 64).notNullable();
    table.string('salt').notNullable();
    table.timestamps(true, true);
  });

  await db.schema.createTable('credentials', (table) => {
    table.increments('id').primary();
    table.integer('userId').notNullable();
    table.string('password').notNullable();
    table.timestamps(true, true);

    table.foreign('userId').references('id').inTable('user').onDelete('CASCADE');
  });
};

exports.down = async (db) => {
  await db.schema.dropTableIfExists('credentials');
  await db.schema.dropTableIfExists('users');
};
