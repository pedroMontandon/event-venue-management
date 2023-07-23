import { Model, QueryInterface, DataTypes } from 'sequelize';
import { IEvent } from '../../interfaces/events/IEvent';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable<Model<IEvent>>('events', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      eventName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'event_name',
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      isOpen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'is_open',
      },
      placesRemaining: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'places_remaining',
      },
    });
  },
  down(queryInterface: QueryInterface) {
    return queryInterface.dropTable('events');
  }
}
