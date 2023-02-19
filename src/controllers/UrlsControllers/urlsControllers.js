const { Sections, Urls } = require('../../db');

module.exports = {
    postUrls: async function(body){
        const {href, name, sections} = body;
        let urlInDb = await Urls.findOne({where: {name}})
        
        if(urlInDb) throw new Error({containErrors: true, message: "Ya existe la URL."})

        if(!href || !name) {
            throw new Error(JSON.stringify({
                containErrors: true, 
                message: "Faltan datos requeridos!"
            }))
        }
        
        let urlCreated = await Urls.create(body);

        if (sections){
            let sectionsDb = await Sections.findAll({where: {name: sections}})
            const newUrl = await urlCreated.addSections(sectionsDb);
            
            throw new Error(JSON.stringify({
                info: newUrl, 
                containErrors: false, 
                message: "La url se creo con exito!"
            }))
        }

        return {info: urlCreated, containErrors: false, message: "La url se creo con exito!"}
    },
    getAllUrls: async function(){
        let allUrls = await Urls.findAll({
            include: {
                model: Sections,
                attributes: ["name"],
                through: {
                    attributes: []
                }
            }
        });

        if (!allUrls) {
            throw new Error(JSON.stringify({containErrors: true, message: "No hay ninguna url!"}))
        }

        return {info: allUrls, message: "Se obtuvieron las urls correctamente.", containsError: false};
    },
    getUrlForName: async function(name) {
        let url = await Urls.findOne({
            where: {name: name},
            include: {
                model: Sections,
                attributes: ["name"],
                through: {
                    attributes: []
                }
            }
        });

        if (!url) {
            return {containsError: true, message: "No hay ninguna url activa con el nombre " + name + "."}
        }

        return {info: url, message: "Se obtuvo la url " + name + " correctamente.", containsError: false};
    }
}