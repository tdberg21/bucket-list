
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('listitems', (table) => {
      table.increments('id').primary();
      table.string('title');
      table.string('description');

      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('listitems')
  ]);
};
