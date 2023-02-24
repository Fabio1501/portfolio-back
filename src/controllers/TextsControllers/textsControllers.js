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
            
            return {
                info: newText, 
                containErrors: false, 
                message: "El texto se creo con exito!"
            }
        }

        return {info: textCreated, containErrors: false, message: "El texto se creo con exito!"}
    },
    postManyTexts: async function(body){
        if (Array.isArray(body)) {
            for (const text of body) {
                const {content, name} = text;
                
                if(!content || !name) {
                    throw new Error(JSON.stringify({
                        containErrors: true, 
                        message: "Faltan datos requeridos!"
                    }))
                }

                let textInDb = await Texts.findOne({where: {name}});
                if(textInDb) throw new Error(JSON.stringify({containErrors: true, message: "Ya existe el texto " + name}))
            }
            
        }
        let urlsCreated = await Texts.bulkCreate(body);

        return {info: urlsCreated, containErrors: false, message: "Los textos se crearon con exito!"}
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
            throw new Error(JSON.stringify({containsError: true, message: "No hay ningun texto activo con el nombre " + name + "."}))
        }

        return {info: text, message: "Se obtuvo el texto " + name + "correctamente.", containsError: false};
    },
    updateText: async function(id, body) {
        const {content, type, name} = body;
        const textId = await Texts.findByPk(id)

        if (!textId) {
            throw new Error(JSON.stringify({containErrors: true, message: "El ID especificado no existe"}))
        }

        await Texts.update({
            content: content ? content : textId.content,
            type: type ? type : textId.type,
            name: name ? name : textId.name,
        },{
            where: {
                id: id
            }
        });

        return {containErrors: false, message: `El texto '${textId.name}' se modificó correctamente.`}
    }
}
