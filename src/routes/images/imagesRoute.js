const express = require('express');
const { getAllImages, postImages } = require('../../controllers/ImagesControllers/imagesControllers');
const router = express.Router();


router.get("/", async (req, res)=>{
    try {
        console.log('llega');
        let allImages = await getAllImages();

        if (allImages.containsError) {
            throw new Error(allImages)
        }
        
        res.send(allImages);
    } catch (error) {
        console.log('llega');
        res.status(404).send(JSON.parse(error.message));
    }
})

router.post("/create", async (req, res)=>{
    try {
        // const {name, images} = body
        let newImage = await postImages(req.body);

        if (newImage.containErrors) {
            throw new Error(newImage)
        }
        
        res.send(newImage);
    } catch (error) {
        res.status(404).send(JSON.parse(error.message));
    }
})

module.exports = router;
