const {TypeOfSection, Sections, Images} = require('../../db');

module.exports = {
    postImages: async function(body){
        const {alt, src, name, sections} = body;
        let ImageInDb = await Images.findOne({where: {name}})
        
        if(ImageInDb) throw new Error({containErrors: true, message: "Ya existe la seccion"})

        if(!alt || !src || !name) throw new Error(JSON.stringify({containErrors: true, message: "Faltan datos requeridos!"}))
        let imageCreated = await Images.create(body);

        if (sections) {
            // console.log(sectionCreated);
            let sectionsDb = await Sections.findAll({where: {name: sections}})
            // console.log(imagesDb + 'llego hasta acà!!!!');
            const newImage = await imageCreated.addSections(sectionsDb);
            // console.log(newSection);
            throw new Error(JSON.stringify({info: newImage, containErrors: false, message: "La imagen se creo con exito!"}))
        }

        return {info: imageCreated, containErrors: false, message: "La imagen se creo con exito!"}
    },
    getAllImages: async function(){
        let allImages = await Images.findAll();

        if (!allImages) {
            throw new Error(JSON.stringify({containErrors: true, message: "No hay ninguna imagen!"}))
        }

        return {info: allImages, message: "Se obtuvieron las secciones correctamente.", containsError: false};
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
