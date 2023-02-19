const { Sections, Texts } = require('../../db');

module.exports = {
    postTexts: async function(body){
        const {content, type, name, sections} = body;
        let textInDb = await Texts.findOne({where: {name}})
        
        if(textInDb) throw new Error({containErrors: true, message: "Ya existe el texto"})

        if(!content || !type || !name) {
            throw new Error(JSON.stringify({
                containErrors: true, 
                message: "Faltan datos requeridos!"
            }))
        }
        
        let textCreated = await Texts.create(body);

        if (sections){
            let sectionsDb = await Sections.findAll({where: {name: sections}})
            const newText = await textCreated.addSections(sectionsDb);
            
            throw new Error(JSON.stringify({
                info: newText, 
                containErrors: false, 
                message: "El texto se creo con exito!"
            }))
        }

        return {info: textCreated, containErrors: false, message: "El texto se creo con exito!"}
    },
    getAllTexts: async function(){
        let allTexts = await Texts.findAll({
            include: {
                model: Sections,
                attributes: ["name"],
                through: {
                    attributes: []
                }
            }
        });

        if (!allTexts) {
            throw new Error(JSON.stringify({containErrors: true, message: "No hay ningun texto!"}))
        }

        return {info: allTexts, message: "Se obtuvieron las secciones correctamente.", containsError: false};
    },
    getTextForName: async function(name) {
        let text = await Texts.findOne({
            where: {name: name},
            include: {
                model: Sections,
                attributes: ["name"],
                through: {
                    attributes: []
                }
            }
        });

        if (!text) {
            return {containsError: true, message: "No hay ningun texto activo con el nombre " + name + "."}
        }

        return {info: text, message: "Se obtuvo el texto " + name + "correctamente.", containsError: false};
    }
}
