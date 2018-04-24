'use strict';

exports.up = async (db) => {
  await db.schema.createTable('weight', (table) => {
    table.increments('id').primary();
    table.integer('userId', 64).notNullable();
    table.enum('type', ['record', 'goal']).defaultTo('record').notNullable();
    table.timestamp('date').notNullable();
    table.float('value').notNullable();
    table.timestamps(true, true);

    table.foreign('userId').references('id').inTable('user').onDelete('CASCADE');
  });
};

exports.down = async (db) => {
  await db.schema.dropTableIfExists('weight');
};
