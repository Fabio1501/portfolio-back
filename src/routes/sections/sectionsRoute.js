const express = require('express');
const { getAllSections, postSections } = require('../../controllers/SectionsControllers/sectionsControllers');
const router = express.Router();


router.get("/", async (req, res)=>{
    try {
        let allSections = await getAllSections();
        console.log(allSections);
        if (allSections.containsError) {
            throw new Error(allSections)
        }
        
        res.send(allSections);
    } catch (error) {
        res.status(404).send(error);
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

module.exports = router;
