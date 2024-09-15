const express = require('express');
const multer = require("../middleware/multer-config");
const auth = require('../middleware/auth');

const {
    createBook,
    getPosts,
    getBookById,
    deleteBook,
    rateBook,
    // editPost,
  } = require("../controllers/books");

  const router = express.Router();

// Route pour obtenir tous les livres
router.get('/', getPosts);

router.get('/:id', getBookById);

// Route pour créer un nouveau livre
router.post('/', auth,multer,createBook);

// Route pour supprimer un livre
router.delete('/:id', auth,deleteBook);

// Route pour la notation
router.post('/:id/rating', auth, rateBook);


// Route pour modifier un livre
// router.put("/:id", editPost);



module.exports = router;
