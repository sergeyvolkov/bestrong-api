'use strict';

module.exports.up = async db => {
  await db.schema.createTable('default_food_component', table => {
    table.increments('id').primary();
    table.string('title').notNullable();
  });

  await db.schema.createTable('food_component', table => {
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
    table.integer('portion_count').notNullable();
    table.enum('portion_unit', ['g', 'piece', 'glass']).notNullable();
    table.timestamps(true, true);

    table.foreign('userId').references('id').inTable('user').onDelete('CASCADE');
  });

  await db.schema.createTable('product_component', table => {
    table.increments('id');
    table.integer('productId').notNullable();
    table.integer('componentId').notNullable();
    table.float('componentValue').notNullable();

    table.foreign('productId').references('id').inTable('product').onDelete('CASCADE');
    table.foreign('componentId').references('id').inTable('food_component').onDelete('CASCADE');
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('product_component');
  await db.schema.dropTableIfExists('product');
  await db.schema.dropTableIfExists('food_component');
  await db.schema.dropTableIfExists('default_food_component');
};
