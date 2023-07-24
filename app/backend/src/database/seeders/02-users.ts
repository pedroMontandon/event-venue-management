import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'adminPassword',
        role: 'admin',
        activation_code: '123456',
        activated: true,
      },
      {
        username: 'user',
        email: 'user@example.com',
        password: 'userPassword',
        role: 'user',
        activation_code: '123456',
        activated: true,
      },
      {
        username: 'inactiveUser',
        email: 'inactiveUser@example.com',
        password: 'inactiveUserPassword',
        role: 'user',
        activation_code: '123456',
        activated: false,
      }
    ])
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('users', {});
  },
}