const express = require('express');
const { getAllUrls, postUrls, getUrlForName } = require('../../controllers/UrlsControllers/urlsControllers');
const router = express.Router();


router.get("/", async (req, res)=>{
    try {
        console.log('llega');
        let allUrls = await getAllUrls();

        if (allUrls.containsError) {
            throw new Error(allUrls)
        }
        
        res.send(allUrls);
    } catch (error) {
        res.status(404).send(JSON.parse(error.message));
    }
})

router.get("/name", async (req, res)=>{
    try {
        let url = await getUrlForName(req.query.name);

        if (url.containsError) {
            throw new Error(url)
        }
        
        res.send(url);
    } catch (error) {
        res.status(404).send(error);
    }
})

router.post("/create", async (req, res)=>{
    try {
        let newUrl = await postUrls(req.body);

        if (newUrl.containErrors) {
            throw new Error(newUrl)
        }
        
        res.send(newUrl);
    } catch (error) {
        res.status(404).send(JSON.parse(error.message));
    }
})

module.exports = router;
