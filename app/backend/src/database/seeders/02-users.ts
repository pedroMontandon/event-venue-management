import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: '$2a$10$nyWr5ohODTV.cwyPkRqI0.Li5FGHNae/Rn4Dgcro9A.UblcTx3dUa',
        // password: adminPassword
        role: 'admin',
        activation_code: '123456',
        activated: true,
      },
      {
        username: 'user',
        email: 'user@example.com',
        password: '$2a$10$gl3LfylFiz8mYiuTsgbM7.4/AWGu98EVMzHHd67a6L65k.NoZeu96',
        // password: userPassword
        role: 'user',
        activation_code: '123456',
        activated: true,
      },
      {
        username: 'inactiveUser',
        email: 'inactiveUser@example.com',
        password: '$2a$10$SeC03pQ8JYKYne6F2MSfPOH7RyB9yK03TvqzCmvP/qJoui/hNPqGq',
        // password: inactiveUserPassword
        role: 'user',
        activation_code: '123456',
        activated: false,
      },
      {
        username: 'employee',
        email: 'employee@example.com',
        password: '$2a$10$6y1rTt4LYcQLiYuz9MrJh.QTD30QTQ0skR9prN686AXo4hmL2/SY6',
        // password: employeePassword,
        role: 'employee',
        activation_code: '123456',
        activated: true, 
      }
    ])
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('users', {});
  },
}