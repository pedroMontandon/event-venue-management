import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
  } from 'sequelize';
  import db from '.';
  import SequelizeUser from './SequelizeUser';
  import SequelizeEvent from './SequelizeEvent';

  class SequelizeTicket extends Model<InferAttributes<SequelizeTicket>, InferCreationAttributes<SequelizeTicket>> {
    declare id: CreationOptional<number>;
    declare eventId: number;
    declare userId: number;
    declare visitor: string;
    declare reclaimed: boolean;
    declare accessKey: string;
  }

  SequelizeTicket.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    visitor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reclaimed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    accessKey: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize: db,
    modelName: 'ticket',
    timestamps: false,
    underscored: true,
  })

  SequelizeTicket.belongsToMany(SequelizeUser, {
    through: SequelizeTicket,
    as: 'users',
    foreignKey: 'user_id',
    otherKey: 'event_id'
  })

  SequelizeTicket.belongsToMany(SequelizeEvent, {
    through: SequelizeTicket,
    as: 'events',
    foreignKey: 'event_id',
    otherKey: 'user_id'
  })

  export default SequelizeTicket;