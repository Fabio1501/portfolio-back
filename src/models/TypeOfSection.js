const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('TypeOfSection', {
    id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.ENUM(
        "home",
        "sobre mi",
        "contacto",
        "habilidades",
        "curriculum",
        "proyectos",
        "blog",
        "experiencia",
        "reseñas",
        "dashboard",
        "detalle proyecto",
        "seccion extra uno",
        "seccion extra dos"
      )
    },
  },{
    timestamps: false
  });
};
