import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'adminPassword',
        role: 'admin',
      },
      {
        username: 'user',
        email: 'user@example.com',
        password: 'userPassword',
        role: 'user',
      }
    ])
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('users', {});
  },
}