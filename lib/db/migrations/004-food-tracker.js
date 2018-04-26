'use strict';

module.exports.up = async db => {
  await db.schema.createTable('defaultFoodComponent', table => {
    table.increments('id').primary();
    table.string('title').notNullable();
  });

  await db.schema.createTable('foodComponent', table => {
    table.increments('id').primary();
    table.integer('userId').notNullable();
    table.string('title');
    table.timestamps(true, true);

    table.foreign('userId').references('id').inTable('user').onDelete('CASCADE');
  });

  await db.schema.createTable('product', table => {
    table.increments('id').primary();
    table.integer('userId').notNullable();
    table.string('title').notNullable();
    table.integer('portionCount').notNullable();
    table.enum('portionUnit', ['g', 'piece', 'glass']).notNullable();
    table.timestamps(true, true);

    table.foreign('userId').references('id').inTable('user').onDelete('CASCADE');
  });

  await db.schema.createTable('productComponent', table => {
    table.increments('id').primary();
    table.integer('productId').notNullable();
    table.integer('componentId').notNullable();
    table.float('componentValue').notNullable();

    table.foreign('productId').references('id').inTable('product').onDelete('CASCADE');
    table.foreign('componentId').references('id').inTable('foodComponent').onDelete('CASCADE');
  });

  await db.schema.createTable('meal', table => {
    table.increments('id').primary();
    table.integer('userId').notNullable();
    table.timestamp('date').notNullable();
    table.string('title').notNullable();
    table.timestamps(true, true);

    table.foreign('userId').references('id').inTable('user').onDelete('CASCADE');
  });

  await db.schema.createTable('mealProduct', table => {
    table.increments('id').primary();
    table.integer('mealId').notNullable();
    table.integer('productId').notNullable();
    table.integer('portionWeight').notNullable();

    table.foreign('mealId').references('id').inTable('meal').onDelete('CASCADE');
    table.foreign('productId').references('id').inTable('product').onDelete('CASCADE');
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('mealProduct');
  await db.schema.dropTableIfExists('meal');
  await db.schema.dropTableIfExists('productComponent');
  await db.schema.dropTableIfExists('product');
  await db.schema.dropTableIfExists('foodComponent');
  await db.schema.dropTableIfExists('defaultFoodComponent');
};
