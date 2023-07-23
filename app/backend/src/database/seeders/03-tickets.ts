import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('tickets', [
      {
        event_id: 1,
        user_id: 1,
        visitor: 'Pedro',
        accessKey: null
      },
      {
        event_id: 1,
        user_id: 1,
        visitor: 'Gabriel',
        accessKey: null
      },
      {
        event_id: 2,
        user_id: 2,
        visitor: 'Gabriel',
        accessKey: null
      },
      {
        event_id: 3,
        user_id: 1,
        visitor: 'Pedro',
        accessKey: 'closed_event'
      }
    ])
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('tickets', {});
  }
}