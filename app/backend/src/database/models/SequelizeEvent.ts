import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
  } from 'sequelize';
  import db from '.';

  class SequelizeEvent extends Model<InferAttributes<SequelizeEvent>, InferCreationAttributes<SequelizeEvent>> {
    declare id: CreationOptional<number>;
    declare eventName: string;
    declare description: string;
    declare date: Date;
    declare price: number;
    declare isOpen: boolean;
    declare placesRemaining: number;
  }

  SequelizeEvent.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eventName: {
      type: DataTypes.STRING,
      allowNull: false,
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
    },
    placesRemaining: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    sequelize: db,
    modelName: 'event',
    timestamps: false,
    underscored: true,
  });

  export default SequelizeEvent;