'use strict';

module.exports.up = async db => {
  await db.schema.createTable('session', table => {
    table.increments('id').primary();
    table.integer('userId', 64).notNullable();
    table.enum('status', ['active', 'inactive']).defaultTo('active').notNullable();
    table.integer('expiredIn').nullable();
    table.timestamps(true, true);

    table.foreign('userId').references('id').inTable('user').onDelete('CASCADE');
  });

  await db.schema.createTable('token', table => {
    table.increments('id').primary();
    table.integer('sessionId', 64).notNullable();
    table.string('rid').notNullable();
    table.enum('type', ['access', 'refresh']).notNullable();
    table.integer('expiresIn').notNullable();
    table.timestamp('expiredAt').nullable();
    table.timestamps(true, true);

    table.foreign('sessionId').references('id').inTable('session').onDelete('CASCADE');
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('token');
  await db.schema.dropTableIfExists('session');
};
