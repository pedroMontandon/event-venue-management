import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('events', [
      {
        event_name: 'Open and free',
        description: 'Good!',
        date: '2023-08-16:18:00',
        price: 0,
        is_open: true,
        places_remaining: 10,
      },
      {
        event_name: 'Open and paid',
        description: 'Also good!',
        date: '2023-09-08:14:00',
        price: 20,
        is_open: true,
        places_remaining: 20,
      },
      {
        event_name: 'Closed',
        description: 'Not good',
        date: '2023-12-25:22:00',
        price: 10,
        is_open: false,
        places_remaining: 30,
      },
      {
        event_name: 'Free, without ticket',
        description: 'yeah!',
        date: '2023-12-25:22:00',
        price: 0,
        is_open: true,
        places_remaining: null,
      }
    ]);
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('events', {});
  }
}