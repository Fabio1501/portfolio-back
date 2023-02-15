const { Router } = require('express');

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
// const routeRecipes = require("./recipes")
// const routeDiets = require("./diets");
const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
// router.use("/recipes", routeRecipes);
// router.use("/diets", routeDiets);
router.use("/prueba", (req, res) => {
    try {
        res.send('esta andando')
    } catch (error) {
        res.send(error)
    }
})
module.exports = router;
