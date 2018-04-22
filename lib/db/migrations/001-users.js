'use strict';

exports.up = async (db) => {
  await db.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username', 64).notNullable();
    table.string('email', 64).notNullable();
    table.timestamps();
  });

  await db.schema.createTable('credentials', (table) => {
    table.integer('userId').notNullable();
    table.string('password').notNullable();
    table.timestamps();

    table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');
  });
};

exports.down = async (db) => {
  await db.schema.dropTableIfExists('credentials');
  await db.schema.dropTableIfExists('users');
};
