import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
  } from 'sequelize';
  import db from '.';

  class SequelizeUser extends Model<InferAttributes<SequelizeUser>, InferCreationAttributes<SequelizeUser>> {
    declare id: CreationOptional<number>;
    declare username: string;
    declare email: string;
    declare password: string;
    declare role: string;
    declare activationCode: string;
    declare activated: boolean;
  }

  SequelizeUser.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activationCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
    }, {
    sequelize: db,
    modelName: 'user',
    timestamps: false,
    underscored: true,
  })

  export default SequelizeUser;