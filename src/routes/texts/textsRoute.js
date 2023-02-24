const express = require('express');
const { getAllTexts, postTexts,postManyTexts, getTextForName, updateText } = require('../../controllers/TextsControllers/textsControllers');
const router = express.Router();


router.get("/", async (req, res)=>{
    try {
        console.log('llega');
        let allTexts = await getAllTexts();

        if (allTexts.containsError) {
            throw new Error(allTexts)
        }
        
        res.send(allTexts);
    } catch (error) {
        res.status(404).send(JSON.parse(error.message));
    }
})

router.get("/name", async (req, res)=>{
    try {
        let text = await getTextForName(req.query.name);
        
        res.send(text);
    } catch (error) {
        res.status(404).send(JSON.parse(error.message));
    }
})

router.post("/create", async (req, res)=>{
    try {
        let newText = await postTexts(req.body);

        if (newText.containErrors) {
            throw new Error(newText)
        }
        
        res.send(newText);
    } catch (error) {
        res.status(404).send(JSON.parse(error.message));
    }
})

router.post("/createmany", async (req, res)=>{
    try {
        let newTexts = await postManyTexts(req.body);

        res.send(newTexts);
    } catch (error) {
        res.status(404).send(JSON.parse(error.message));
    }
})

router.put("/:id", async (req, res)=>{
    try {
        let text = await updateText(req.params.id, req.body);
        
        res.send(text);
    } catch (error) {
        res.status(404).send(JSON.parse(error.message));
    }
})

module.exports = router;
