const {TypeOfSection, Sections, Images} = require('../../db');

module.exports = {
    postImages: async function(body){
        const {alt, src, name, sections} = body;
        let ImageInDb = await Images.findOne({where: {name}})
        
        if(ImageInDb) throw new Error({containErrors: true, message: "Ya existe la seccion"})

        if(!alt || !src || !name) throw new Error(JSON.stringify({containErrors: true, message: "Faltan datos requeridos!"}))
        let imageCreated = await Images.create(body);

        if (sections) {
            let sectionsDb = await Sections.findAll({where: {name: sections}})
            const newImage = await imageCreated.addSections(sectionsDb);

            return{info: newImage, containErrors: false, message: "La imagen se creo con exito!"}
        }

        return {info: imageCreated, containErrors: false, message: "La imagen se creo con exito!"}
    },
    getAllImages: async function(){
        let allImages = await Images.findAll({
            include: {
                model: Sections,
                attributes: ["name"],
                through: {
                    attributes: []
                }
            }
        });

        if (!allImages) {
            throw new Error(JSON.stringify({containErrors: true, message: "No hay ninguna imagen!"}))
        }

        return {info: allImages, message: "Se obtuvieron las secciones correctamente.", containsError: false};
    },
    getImageForName: async function(name) {
        let section = await Images.findOne({
            where: {name: name},
            include: {
                model: Sections,
                attributes: ["name"],
                through: {
                    attributes: []
                }
            }
        });

        if (!section) {
            throw new Error(JSON.stringify({containsError: true, message: "No hay ninguna imagen activa con el nombre " + name + "."}))
        }

        return {info: section, message: "Se obtuvo la imagen " + name + "correctamente.", containsError: false};
    },
    updateImages: async function(id, body) {
        const {alt, src, name} = body;
        const imagesId = await Images.findByPk(id)

        if (!imagesId) {
            throw new Error(JSON.stringify({containErrors: true, message: "El ID especificado no existe"}))
        }

        await Images.update({
            alt: alt ? alt : imagesId.alt,
            src: src ? src : imagesId.src,
            name: name ? name : imagesId.name,
        },{
            where: {
                id: id
            }
        });

        return {containErrors: false, message: `La imagen '${imagesId.name}' se modificó correctamente.`}
    }
}
