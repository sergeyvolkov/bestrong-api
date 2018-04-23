'use strict';

exports.up = async (db) => {
  await db.schema.createTable('token', (table) => {
    table.increments('id').primary();
    table.integer('userId', 64).notNullable();
    table.string('rid').notNullable();
    table.timestamp('expiresIn').notNullable();
    table.timestamp('expiresAt').nullable();
    table.timestamps(true, true);

    table.foreign('userId').references('id').inTable('user').onDelete('CASCADE');
  });
};

exports.down = async (db) => {
  await db.schema.dropTableIfExists('token');
};
