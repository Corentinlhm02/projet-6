const express = require('express');
const multer = require("../middleware/multer-config");
const auth = require('../middleware/auth');
const sharp = require("../middleware/sharp-config");

const {
    createBook,
    getPosts,
    getBookById,
    deleteBook,
    rateBook,
    editBook,
    getBestRatedBooks,
  } = require("../controllers/books");

  const router = express.Router();

// Route pour obtenir les 3 livres les mieux notés
router.get('/bestrating', getBestRatedBooks);

// Route pour obtenir tous les livres
router.get('/', getPosts);

// Route pour obtenir un livre
router.get('/:id', getBookById);

// Route pour créer un nouveau livre
router.post('/', auth,multer,sharp,createBook);

// Route pour supprimer un livre
router.delete('/:id', auth,deleteBook);

// Route pour la notation
router.post('/:id/rating', auth, rateBook);

// Route pour modifier un livre
router.put("/:id", auth, multer, sharp, editBook);



module.exports = router;
