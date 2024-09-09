const express = require('express');
const router = express.Router();

const authController = require("../controllers/auth");

// Route pour l'inscription
router.post('/signup', authController.signup);

router.post('/login', (req, res) => {
    console.log('Route /login atteinte');
    authController.login(req, res);
});



module.exports = router;
