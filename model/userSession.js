
module.exports = (sequelize, DataTypes) => {
    const usersessionModel = sequelize.define('UserSession', {
      user_id: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        primaryKey: true
      },
      token: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false
      },
      app_id: {
        type: DataTypes.INTEGER,
        required: true,
        allowNull: false
      },
      app_token: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false
      },
      last_login: {
        type: DataTypes.DATE,
        required: true,
        allowNull: false
      },
      last_logout: {
        type: DataTypes.DATE,
        required: true,
        allowNull: false
      },
      created_on: {
        type: DataTypes.DATE,
        required: true,
        allowNull: false
      },
      updated_on: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }, {
      tableName: 'user_session',
      timestamps: false,
      paranoid: true
    })
    return usersessionModel
  }
  