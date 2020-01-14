import { QueryInterface, Sequelize } from 'sequelize';
module.exports = {
  // tslint:disable-next-line:variable-name
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  // Write migration code here.
  },
  // tslint:disable-next-line:variable-name
  down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  // If migration fails, this will be called. Rollback your migration changes.
  },
};
