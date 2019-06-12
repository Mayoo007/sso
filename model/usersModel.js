
module.exports = (sequelize, DataTypes) => {
  const masterCityModel = sequelize.define('UserModel', {
    user_id: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
      primaryKey: true
    },
    email_id: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false
    },
    mobile_no: {
      type: DataTypes.INTEGER,
      required: true,
      allowNull: false
    },
    vertical_id: {
      type: DataTypes.INTEGER,
      required: true,
      allowNull: false
    },
    dept_id: {
      type: DataTypes.INTEGER,
      required: true,
      allowNull: false
    },
    token_id: {
      type: DataTypes.INTEGER,
      required: true,
      allowNull: false
    },
    is_mll: {
      type: DataTypes.TINYINT,
      required: true,
      allowNull: false
    },
    auth_token: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER
    },
    created_on: {
      type: DataTypes.DATE,
      required: true,
      allowNull: false
    },
    updated_by: {
      type: DataTypes.INTEGER
    },
    updated_on: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.ENUM,
      required: true,
      values: ['active', 'invited', 'blocked']
    }
  }, {
    tableName: 'users',
    timestamps: false,
    paranoid: true
  })
  return masterCityModel
}
