const {TypeOfSection, Sections, Images, Urls, Texts} = require('../../db');

module.exports = {
    postSections: async function(body){
        const {name, images} = body;
        let sectionInDb = await Sections.findOne({
            where: {name: name},
            
        })
        
        if(sectionInDb !== null) {
            throw new Error(JSON.stringify({containErrors: true, message: "Ya existe la seccion"}))
        }
        
        if(!name || !images) throw new Error(JSON.stringify({containErrors: true, message: "Faltan datos requeridos!"}))
        
        let sectionCreated = await Sections.create({...body,
            include: {
                model: Images,
                attributes: ["alt", "src", "id", "name"],
                through: {
                    attributes: []
            }}});
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

        if (!allSections) {
            throw new Error(JSON.stringify({containsError: true, message: "No hay ninguna seccion activa."})) 
        }

        return {info: allSections, message: "Se obtuvieron las secciones correctamente.", containsError: false};
    },
    addItemToASection: async function(body, query){
        const {name} = query;
        const {item, content} = body;

        let section = await Sections.findOne({
            where: {name: name},
            include: {
                model: item === 'Images' ? Images : item === 'Urls' ? Urls : Texts,
                attributes: ["alt", "src", "id", "name"],
                through: {
                    attributes: []
                }
            }
        });

        if (!section) {
            throw new Error(JSON.stringify({containsError: true, message: "No hay ninguna seccion con ese nombre."}))
        }

        let imagesDb = await Images.findAll({where: {name: content}})
        await section[`add${item}`](imagesDb);
        let sectionAdd = await Sections.findOne({
            where: {name: name},
            include: {
                model: item === 'Images' ? Images : item === 'Urls' ? Urls : Texts,
                attributes: ["alt", "src", "id", "name"],
                through: {
                    attributes: []
                }
            }
        });

        if (sectionAdd.Images.length > section.Images.length) {
            throw new Error(JSON.stringify({info: sectionAdd, containErrors: false, message: "Los items se agregaron correctamente!"}))   
        }

        return {info: sectionAdd, containErrors: true, message: "Los items no se agregaron!"}  
    },
    getSectionForName: async function(name) {
        let section = await Sections.findOne({
            where: {name: name},
            include: {
                model: Images,
                attributes: ["alt", "src", "id", "name"],
                through: {
                    attributes: []
                }
            }
        });

        if (!section) {
            throw new Error(JSON.stringify({containsError: true, message: "No hay ninguna sección activa con el nombre " + name + "."}))
        }

        return {info: section, message: "Se obtuvo la seccion " + name + "correctamente.", containsError: false};
    }
}
