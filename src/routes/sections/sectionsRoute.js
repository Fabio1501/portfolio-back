const express = require('express');
const { getAllSections, postSections, addItemToASection, getSectionForName } = require('../../controllers/SectionsControllers/sectionsControllers');
const router = express.Router();

router.get("/", async (req, res)=>{
    try {
        let allSections = await getAllSections();
        
        res.send(allSections);
    } catch (error) {
        res.status(404).send(JSON.parse(error.message));
    }
})

router.get("/name", async (req, res)=>{
    try {
        let section = await getSectionForName(req.query.name);
        
        res.send(section);
    } catch (error) {
        res.status(404).send(JSON.parse(error.message));
    }
})

router.post("/create", async (req, res)=>{
    try {
        // const {name, images} = body
        let allSections = await postSections(req.body);
        
        res.send(allSections);
    } catch (error) {
        res.status(404).send(JSON.parse(error.message));
    }
})

router.put("/update", async (req, res)=>{
    try {
        // const {name, images} = body
        let section = await addItemToASection(req.body, req.query);
        
        res.send(section);
    } catch (error) {
        res.status(404).send(JSON.parse(error.message));
    }
})

module.exports = router;
