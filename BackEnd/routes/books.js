const express = require('express');
const {
    createBook,
    getPosts,
    getBookById,
    deleteBook,
    // editPost,
  } = require("../controllers/books");

  const router = express.Router();

// Route pour obtenir tous les livres
router.get('/', getPosts);

// Route pour créer un nouveau livre
router.post('/', createBook);

// Route pour obtenir un livre par ID
// router.get('/:id', getBookById);

// Route pour modifier un livre
// router.put("/:id", editPost);

// Route pour supprimer un livre
router.delete('/:id', deleteBook);


module.exports = router;
