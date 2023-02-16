const express = require('express');
const { getAllSections } = require('../../controllers/SectionsControllers/sectionsControllers');
const router = express.Router();


router.get("/", async (req, res)=>{
    try {
        let allSections = await getAllSections();

        if (allSections.containsError) {
            throw new Error(allSections)
        }
        
        res.send(allSections);
    } catch (error) {
        res.status(404).send(error);
    }
})

module.exports = router;
