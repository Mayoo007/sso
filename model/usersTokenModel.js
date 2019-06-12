const Sequelize = require('sequelize')

const sequelize = require('../config/db/dbConn').sequelize

const usersToken = sequelize.define('usersToken', {
  user_id: {
    type: Sequelize.INTEGER,
    required: true,
    allowNull: false
  },
  token: {
    type: Sequelize.STRING,
    required: true,
    allowNull: false
  },
  created_on: {
    type: Sequelize.DATE,
    required: true,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM,
    required: true,
    values: ['active', 'inactive']
  }
}, {
  tableName: 'users_token',
  timestamps: false,
  paranoid: true
})

module.exports.usersToken = usersToken
