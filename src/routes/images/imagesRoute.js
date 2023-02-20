const express = require('express');
const { getAllImages, postImages, getImageForName, updateImages } = require('../../controllers/ImagesControllers/imagesControllers');
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

router.get("/name", async (req, res)=>{
    try {
        let image = await getImageForName(req.query.name);

        if (image.containsError) {
            throw new Error(image)
        }
        
        res.send(image);
    } catch (error) {
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

router.put("/:id", async (req, res)=>{
    try {
        let images = await updateImages(req.params.id, req.body);
        
        res.send(images);
    } catch (error) {
        res.status(404).send(JSON.parse(error.message));
    }
})

module.exports = router;
