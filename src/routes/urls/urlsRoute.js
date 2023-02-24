const express = require('express');
const { getAllUrls, postUrls, getUrlForName,postManyUrls, updateUrls } = require('../../controllers/UrlsControllers/urlsControllers');
const router = express.Router();


router.get("/", async (req, res)=>{
    try {
        let allUrls = await getAllUrls();
        
        res.send(allUrls);
    } catch (error) {
        res.status(404).send(JSON.parse(error.message));
    }
})

router.get("/name", async (req, res)=>{
    try {
        let url = await getUrlForName(req.query.name);
        
        res.send(url);
    } catch (error) {
        res.status(404).send(JSON.parse(error.message));
    }
})

router.post("/create", async (req, res)=>{
    try {
        let newUrl = await postUrls(req.body);

        res.send(newUrl);
    } catch (error) {
        res.status(404).send(JSON.parse(error.message));
    }
})

router.post("/createmany", async (req, res)=>{
    try {
        let newUrls = await postManyUrls(req.body);

        res.send(newUrls);
    } catch (error) {
        res.status(404).send(JSON.parse(error.message));
    }
})

router.put("/:id", async (req, res)=>{
    try {
        let images = await updateUrls(req.params.id, req.body);
        
        res.send(images);
    } catch (error) {
        res.status(404).send(JSON.parse(error.message));
    }
})

module.exports = router;
