const {TypeOfSection, Sections, Images} = require('../../db');

module.exports = {
    postSections: async function(body){
        const {name, images} = body;
        let sectionInDb = await Sections.findOne({where: {name: name}})
        
        if(sectionInDb !== null) {
            throw new Error(JSON.stringify({containErrors: true, message: "Ya existe la seccion"}))
            // let imagesDb = await Images.findAll({where: {name: images}})
            // let newSection = await sectionInDb.addImages(imagesDb);
            // return {info: {...newSection, ...sectionInDb}, containErrors: false, message: "La seccion se creo con exito!"}   
        }
        
        if(!name || !images) throw new Error(JSON.stringify({containErrors: true, message: "Faltan datos requeridos!"}))
        
        let sectionCreated = await Sections.create(body);
        let imagesDb = await Images.findAll({where: {name: images}})
        let newSection = await sectionCreated.addImages(imagesDb);
        
        return {info: {...newSection, ...sectionCreated}, containErrors: false, message: "La seccion se creo con exito!"}
    },
    getAllSections: async function(){
        let allSections = await Sections.findAll({
            include: {
                model: Images,
                attributes: ["alt", "src", "id", "name"],
                through: {
                    attributes: []
                }
            }
        });
        console.log('llega hasta acá?');
        if (!allSections) {
            return {containsError: true, message: "No hay ninguna seccion activa."}
        }

        return {info: allSections, message: "Se obtuvieron las secciones correctamente.", containsError: false};
    },
    getSectionForName: async function(body) {
        const {name} = body;
        let allSections = await Sections.findAll({
            where: {name}
        });

        if (!allSections) {
            return {containsError: true, message: "No hay ninguna sección activa con el nombre " + name + "."}
        }

        return {info: allSections, message: "Se obtuvo las seccion " + name + "correctamente.", containsError: false};
    }
}
