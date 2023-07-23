import { Model, QueryInterface, DataTypes } from 'sequelize';
import { ITicket } from '../../interfaces/tickets/ITicket';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable<Model<ITicket>>('tickets', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'event_id',
        references: {
          model: { tableName: 'events' },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
          model: { tableName: 'users' },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      visitor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accessKey: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('tickets');
  }
}