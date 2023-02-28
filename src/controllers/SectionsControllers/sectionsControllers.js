const {TypeOfSection, Sections, Images, Urls, Texts} = require('../../db');

module.exports = {
    postSections: async function(body){
        const {name, images, texts, urls, staticComponents} = body;
        
        if(!name) throw new Error(JSON.stringify({containErrors: true, message: "Faltan datos requeridos!"}))

        let sectionInDb = await Sections.findOne({
            where: {name: name}
        })
        
        if(sectionInDb !== null) {
            throw new Error(JSON.stringify({containErrors: true, message: "Ya existe la seccion"}))
        }
        
        let sectionCreated = await Sections.create({...body,
            include: [
                {
                    model: Images,
                    attributes: ["src", "alt", "id", "name"],
                    through: {
                        attributes: []
                    }
                },
                {
                    model: Urls,
                    attributes: ["target", "href", "id", "name"],
                    through: {
                        attributes: []
                    }
                },
                {
                    model: Texts,
                    attributes: ["content", "id", "name"],
                    through: {
                        attributes: []
                    }
                }
            ]
        });

        if (images) {
            let imagesDb = await Images.findAll({where: {name: images}})
            await sectionCreated.addImages(imagesDb);
        }
        if (urls) {
            let urlsDb = await Urls.findAll({where: {name: urls}})
            await sectionCreated.addUrls(urlsDb);
        }
        if (texts) {
            let textsDb = await Texts.findAll({where: {name: texts}})
            await sectionCreated.addTexts(textsDb);
        }

        if (staticComponents) {
            let staticComponentsDb = await Sections.findAll({where: {name: staticComponents}})
            await sectionCreated.addStaticComponents(staticComponentsDb);
        }
        
        return {info: sectionCreated, containErrors: false, message: "La seccion se creo con exito!"}
    },
    getAllSections: async function(){
        let allSections = await Sections.findAll({
            include: [
                {
                    model: Images,
                    attributes: ["type", "src", "alt", "id", "name"],
                    through: {
                        attributes: []
                    }
                },
                {
                    model: Urls,
                    attributes: ["type", "href", "target", "id", "name"],
                    through: {
                        attributes: []
                    }
                },
                {
                    model: Texts,
                    attributes: ["type", "content", "id", "name"],
                    through: {
                        attributes: []
                    }
                },
                {
                    model: Sections,
                    as: "staticComponents",
                    through: {
                        attributes: []
                    },
                    include : [
                        {
                            model: Images,
                            attributes: ["src", "alt", "id", "name"],
                            through: {
                                attributes: []
                            }
                        },
                        {
                            model: Urls,
                            attributes: ["href", "target", "id", "name"],
                            through: {
                                attributes: []
                            }
                        },
                        {
                            model: Texts,
                            attributes: ["content", "id", "name"],
                            through: {
                                attributes: []
                            }
                        }
                    ]
                }
            ]
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
                attributes: ["type", "id", "name"],
                through: {
                    attributes: []
                }
            }
        });

        if (!section) {
            throw new Error(JSON.stringify({containsError: true, message: "No hay ninguna seccion con ese nombre."}))
        }

        let itemDb = item === 'Images' ? 
        await Images.findAll({where: {name: content}}) : 
        item === 'Urls' ? 
        await Urls.findAll({where: {name: content}}) : 
        await Texts.findAll({where: {name: content}});

        await section[`add${item}`](itemDb);

        let sectionAdd = await Sections.findOne({
            where: {name: name},
            include: {
                model: item === 'Images' ? Images : item === 'Urls' ? Urls : Texts,
                attributes: ["type", "id", "name"],
                through: {
                    attributes: []
                }
            }
        });

        if (sectionAdd[`${item}`].length > section[`${item}`].length) {
            return{info: sectionAdd, containErrors: false, message: "Los items se agregaron correctamente!"}   
        }

        throw new Error(JSON.stringify({info: sectionAdd, containErrors: true, message: "Los items no se agregaron!"}))  
    },
    getSectionForName: async function(name) {
        let section = await Sections.findOne({
            where: {name: name},
            include: [
                {
                    model: Images,
                    attributes: ["type", "src", "alt", "id", "name"],
                    through: {
                        attributes: []
                    }
                },
                {
                    model: Urls,
                    attributes: ["type", "href", "target", "id", "name"],
                    through: {
                        attributes: []
                    }
                },
                {
                    model: Texts,
                    attributes: ["type", "content", "id", "name"],
                    through: {
                        attributes: []
                    }
                },
                {
                    model: Sections,
                    as: "staticComponents",
                    through: {
                        attributes: []
                    },
                    include : [
                        {
                            model: Images,
                            attributes: ["src", "alt", "id", "name"],
                            through: {
                                attributes: []
                            }
                        },
                        {
                            model: Urls,
                            attributes: ["href", "target", "id", "name"],
                            through: {
                                attributes: []
                            }
                        },
                        {
                            model: Texts,
                            attributes: ["content", "id", "name"],
                            through: {
                                attributes: []
                            }
                        }
                    ]
                }
            ]
        });

        if (!section) {
            throw new Error(JSON.stringify({containsError: true, message: "No hay ninguna sección activa con el nombre " + name + "."}))
        }

        return {info: section, message: "Se obtuvo la seccion " + name + "correctamente.", containsError: false};
    }
}
