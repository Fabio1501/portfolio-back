const { Router } = require('express');

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
// const routeRecipes = require("./recipes")
const routeSections = require("./sections/sectionsRoute");
const routeImages = require("./images/imagesRoute");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
// router.use("/recipes", routeRecipes);
// router.use("/diets", routeDiets);
router.use("/sections", routeSections)
router.use("/images", routeImages)

module.exports = router;
