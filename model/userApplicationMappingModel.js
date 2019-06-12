
module.exports = (sequelize, DataTypes) => {
  const userApplicationMapping = sequelize.define('userApplicationMappingModel', {
    id: {
      type: DataTypes.INTEGER,
      required: true,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false
    },
    app_id: {
      type: DataTypes.INTEGER,
      required: true,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      required: true
    },
    updated_by: {
      type: DataTypes.INTEGER
    },
    updated_on: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      required: true
    }
  }, {
    tableName: 'user_application_mapping',
    timestamps: false,
    paranoid: true
  })
  return userApplicationMapping
}
