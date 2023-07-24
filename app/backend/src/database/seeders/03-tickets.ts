import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('tickets', [
      {
        event_id: 1,
        user_id: 1,
        visitor: 'Pedro',
        reclaimed: false,
        access_key: '1Pedro'
      },
      {
        event_id: 1,
        user_id: 1,
        visitor: 'Gabriel',
        reclaimed: true,
        access_key: '1Gabriel'
      },
      {
        event_id: 2,
        user_id: 2,
        visitor: 'Gabriel',
        reclaimed: false,
        access_key: '2Gabriel'
      },
      {
        event_id: 3,
        user_id: 1,
        visitor: 'Pedro',
        reclaimed: false,
        access_key: '3Pedro'
      }
    ])
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('tickets', {});
  }
}