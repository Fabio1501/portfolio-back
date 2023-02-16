const {TypeOfSection} = require('../../db');

module.exports = {
    postSections: async function(){
        let sections = [
            {name: "home"},
            {name: "sobre mi"},
            {name: "contacto"},
            {name: "habilidades"},
            {name: "curriculum"},
            {name: "proyectos"},
            {name: "blog"},
            {name: "experiencia"},
            {name: "reseñas"},
            {name: "dashboard"},
            {name: "detalle proyecto"},
            {name: "seccion extra uno"},
            {name: "seccion extra dos"}
        ]

        await TypeOfSection.bulkCreate(sections);
    },
    getAllSections: async function(){
        let allSections = await TypeOfSection.findAll({
            attributes: ['name']
        });

        if (!allSections) {
            return {containsError: true, message: "No hay ninguna seccion activa."}
        }

        return {info: allSections, message: "Se obtuvieron las secciones correctamente.", containsError: false};
    }
}
