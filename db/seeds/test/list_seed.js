
exports.seed = (knex, Promise) => {
  return knex('listitems').del()
    .then(() => {
      return knex('listitems').insert([
        { id: 4, title: 'listItem1', description: 'item number 1' },
        { id: 5, title: 'listItem2', description: 'item number 2' },
        { id: 6, title: 'listItem3', description: 'item number 3' }
      ]);
    });
};
